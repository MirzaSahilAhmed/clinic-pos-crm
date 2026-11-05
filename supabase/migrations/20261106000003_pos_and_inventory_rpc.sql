-- CLINIC POS + CRM SAAS APPLICATION - ATOMIC POS SALE RPC & CONCURRENCY CONTROL
-- Migration: 20261106000003_pos_and_inventory_rpc.sql

CREATE OR REPLACE FUNCTION execute_pos_sale(p_sale JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clinic_id UUID;
  v_patient_id UUID;
  v_doctor_id UUID;
  v_visit_id UUID;
  v_cashier_id UUID;
  v_idempotency_key TEXT;
  v_notes TEXT;
  
  v_existing_invoice_id UUID;
  v_new_invoice_id UUID;
  v_invoice_number TEXT;
  v_invoice_count INT;
  v_year TEXT;
  
  v_items JSONB;
  v_item JSONB;
  v_payments JSONB;
  v_payment JSONB;
  
  v_subtotal NUMERIC(12,2) := 0.00;
  v_discount NUMERIC(12,2) := 0.00;
  v_tax NUMERIC(12,2) := 0.00;
  v_grand_total NUMERIC(12,2) := 0.00;
  v_total_paid NUMERIC(12,2) := 0.00;
  v_balance_due NUMERIC(12,2) := 0.00;
  v_status TEXT := 'unpaid';
  
  v_item_type TEXT;
  v_service_id UUID;
  v_product_id UUID;
  v_batch_id UUID;
  v_item_name TEXT;
  v_qty INT;
  v_unit_price NUMERIC(12,2);
  v_item_discount NUMERIC(12,2);
  v_item_tax_rate NUMERIC(5,2);
  v_item_tax_amount NUMERIC(12,2);
  v_item_total NUMERIC(12,2);
  
  v_current_stock INT;
  v_batch_qty INT;
  v_new_stock INT;
  v_payment_id UUID;
  v_payment_number TEXT;
  v_payment_amount NUMERIC(12,2);
  v_payment_method TEXT;
  v_payment_ref TEXT;
BEGIN
  -- 1. Extract Header Inputs
  v_clinic_id := (p_sale->>'clinic_id')::UUID;
  v_patient_id := (p_sale->>'patient_id')::UUID;
  v_doctor_id := NULLIF(p_sale->>'doctor_id', '')::UUID;
  v_visit_id := NULLIF(p_sale->>'visit_id', '')::UUID;
  v_cashier_id := NULLIF(p_sale->>'cashier_id', '')::UUID;
  v_idempotency_key := p_sale->>'idempotency_key';
  v_notes := p_sale->>'notes';
  v_items := p_sale->'items';
  v_payments := p_sale->'payments';

  IF v_clinic_id IS NULL OR v_patient_id IS NULL OR v_items IS NULL OR jsonb_array_length(v_items) = 0 THEN
    RAISE EXCEPTION 'Invalid sale payload: clinic_id, patient_id, and at least one item are required.';
  END IF;

  -- 2. Idempotency Check (prevent duplicate checkout)
  IF v_idempotency_key IS NOT NULL AND v_idempotency_key <> '' THEN
    SELECT id INTO v_existing_invoice_id FROM invoices 
    WHERE clinic_id = v_clinic_id AND idempotency_key = v_idempotency_key;
    
    IF v_existing_invoice_id IS NOT NULL THEN
      RETURN jsonb_build_object(
        'success', true,
        'invoice_id', v_existing_invoice_id,
        'message', 'Duplicate request handled idempotently'
      );
    END IF;
  END IF;

  -- 3. Calculate Item Totals Server-Side (Never trust client math)
  FOR i IN 0 .. jsonb_array_length(v_items) - 1 LOOP
    v_item := v_items->i;
    v_qty := GREATEST((v_item->>'quantity')::INT, 1);
    v_unit_price := (v_item->>'unit_price')::NUMERIC(12,2);
    v_item_discount := COALESCE((v_item->>'discount_amount')::NUMERIC(12,2), 0.00);
    v_item_tax_rate := COALESCE((v_item->>'tax_rate')::NUMERIC(5,2), 0.00);
    
    v_item_tax_amount := ROUND(((v_unit_price * v_qty - v_item_discount) * (v_item_tax_rate / 100.0)), 2);
    v_item_total := (v_unit_price * v_qty - v_item_discount) + v_item_tax_amount;
    
    v_subtotal := v_subtotal + (v_unit_price * v_qty);
    v_discount := v_discount + v_item_discount;
    v_tax := v_tax + v_item_tax_amount;
    v_grand_total := v_grand_total + v_item_total;
  END LOOP;

  -- Additional overall discount if provided
  IF (p_sale->>'invoice_discount') IS NOT NULL THEN
    v_discount := v_discount + (p_sale->>'invoice_discount')::NUMERIC(12,2);
    v_grand_total := GREATEST(0.00, v_grand_total - (p_sale->>'invoice_discount')::NUMERIC(12,2));
  END IF;

  -- 4. Calculate Payments and Status
  IF v_payments IS NOT NULL AND jsonb_array_length(v_payments) > 0 THEN
    FOR i IN 0 .. jsonb_array_length(v_payments) - 1 LOOP
      v_payment := v_payments->i;
      v_total_paid := v_total_paid + (v_payment->>'amount')::NUMERIC(12,2);
    END LOOP;
  END IF;

  v_balance_due := GREATEST(0.00, v_grand_total - v_total_paid);
  
  IF v_total_paid >= v_grand_total THEN
    v_status := 'paid';
  ELSIF v_total_paid > 0 THEN
    v_status := 'partially_paid';
  ELSE
    v_status := 'unpaid';
  END IF;

  -- 5. Generate Next Sequential Invoice Number
  v_year := to_char(CURRENT_DATE, 'YYYY');
  SELECT COUNT(*) + 1 INTO v_invoice_count FROM invoices WHERE clinic_id = v_clinic_id;
  v_invoice_number := 'INV-' || v_year || '-' || LPAD(v_invoice_count::TEXT, 6, '0');

  -- 6. Insert Invoice Record
  INSERT INTO invoices (
    clinic_id, invoice_number, patient_id, doctor_id, visit_id,
    invoice_date, subtotal, discount_amount, tax_amount, total_amount,
    paid_amount, balance_due, payment_status, idempotency_key, notes, cashier_id
  ) VALUES (
    v_clinic_id, v_invoice_number, v_patient_id, v_doctor_id, v_visit_id,
    now(), v_subtotal, v_discount, v_tax, v_grand_total,
    v_total_paid, v_balance_due, v_status, v_idempotency_key, v_notes, v_cashier_id
  ) RETURNING id INTO v_new_invoice_id;

  -- 7. Insert Invoice Items and Handle Safe Inventory Deductions
  FOR i IN 0 .. jsonb_array_length(v_items) - 1 LOOP
    v_item := v_items->i;
    v_item_type := v_item->>'item_type';
    v_service_id := NULLIF(v_item->>'service_id', '')::UUID;
    v_product_id := NULLIF(v_item->>'product_id', '')::UUID;
    v_batch_id := NULLIF(v_item->>'batch_id', '')::UUID;
    v_item_name := v_item->>'item_name';
    v_qty := GREATEST((v_item->>'quantity')::INT, 1);
    v_unit_price := (v_item->>'unit_price')::NUMERIC(12,2);
    v_item_discount := COALESCE((v_item->>'discount_amount')::NUMERIC(12,2), 0.00);
    v_item_tax_rate := COALESCE((v_item->>'tax_rate')::NUMERIC(5,2), 0.00);
    v_item_tax_amount := ROUND(((v_unit_price * v_qty - v_item_discount) * (v_item_tax_rate / 100.0)), 2);
    v_item_total := (v_unit_price * v_qty - v_item_discount) + v_item_tax_amount;

    -- Inventory Deduction with Concurrency Control
    IF v_item_type = 'product' AND v_product_id IS NOT NULL THEN
      -- Deduct from specific batch if provided, otherwise deduct from earliest expiring batch (FEFO)
      IF v_batch_id IS NOT NULL THEN
        SELECT current_quantity INTO v_batch_qty 
        FROM product_batches 
        WHERE id = v_batch_id FOR UPDATE;

        IF v_batch_qty IS NULL OR v_batch_qty < v_qty THEN
          RAISE EXCEPTION 'Insufficient stock in batch for item: % (Available: %, Requested: %)', v_item_name, COALESCE(v_batch_qty, 0), v_qty;
        END IF;

        UPDATE product_batches 
        SET current_quantity = current_quantity - v_qty 
        WHERE id = v_batch_id;
      ELSE
        -- Auto-select earliest expiring batch with available stock
        SELECT id, current_quantity INTO v_batch_id, v_batch_qty
        FROM product_batches
        WHERE product_id = v_product_id AND current_quantity >= v_qty AND expiry_date >= CURRENT_DATE
        ORDER BY expiry_date ASC
        LIMIT 1
        FOR UPDATE;

        IF v_batch_id IS NOT NULL THEN
          UPDATE product_batches 
          SET current_quantity = current_quantity - v_qty 
          WHERE id = v_batch_id;
        END IF;
      END IF;

      -- Update parent product current_stock
      SELECT current_stock INTO v_current_stock 
      FROM products 
      WHERE id = v_product_id FOR UPDATE;

      IF v_current_stock IS NULL OR v_current_stock < v_qty THEN
        RAISE EXCEPTION 'Insufficient overall product stock for: % (Available: %, Requested: %)', v_item_name, COALESCE(v_current_stock, 0), v_qty;
      END IF;

      v_new_stock := v_current_stock - v_qty;
      UPDATE products SET current_stock = v_new_stock, updated_at = now() WHERE id = v_product_id;

      -- Record Inventory Transaction
      INSERT INTO inventory_transactions (
        clinic_id, product_id, batch_id, transaction_type,
        quantity_delta, balance_after, reference_type, reference_id,
        notes, created_by
      ) VALUES (
        v_clinic_id, v_product_id, v_batch_id, 'sale',
        -v_qty, v_new_stock, 'invoice', v_new_invoice_id,
        'POS Sale ' || v_invoice_number, v_cashier_id
      );
    END IF;

    -- Insert Invoice Item
    INSERT INTO invoice_items (
      invoice_id, item_type, service_id, product_id, batch_id,
      item_name, quantity, unit_price, discount_amount, tax_rate, tax_amount, total_price
    ) VALUES (
      v_new_invoice_id, v_item_type, v_service_id, v_product_id, v_batch_id,
      v_item_name, v_qty, v_unit_price, v_item_discount, v_item_tax_rate, v_item_tax_amount, v_item_total
    );
  END LOOP;

  -- 8. Insert Payments (Split Payments Supported)
  IF v_payments IS NOT NULL AND jsonb_array_length(v_payments) > 0 THEN
    FOR i IN 0 .. jsonb_array_length(v_payments) - 1 LOOP
      v_payment := v_payments->i;
      v_payment_amount := (v_payment->>'amount')::NUMERIC(12,2);
      v_payment_method := v_payment->>'payment_method';
      v_payment_ref := v_payment->>'reference_number';
      v_payment_number := 'PAY-' || v_year || '-' || LPAD((v_invoice_count * 10 + i + 1)::TEXT, 6, '0');

      IF v_payment_amount > 0 THEN
        INSERT INTO payments (
          clinic_id, payment_number, invoice_id, patient_id,
          payment_date, amount, payment_method, reference_number,
          received_by, notes
        ) VALUES (
          v_clinic_id, v_payment_number, v_new_invoice_id, v_patient_id,
          now(), v_payment_amount, v_payment_method, v_payment_ref,
          v_cashier_id, 'Payment for ' || v_invoice_number
        ) RETURNING id INTO v_payment_id;

        INSERT INTO payment_allocations (
          payment_id, invoice_id, allocated_amount
        ) VALUES (
          v_payment_id, v_new_invoice_id, v_payment_amount
        );
      END IF;
    END LOOP;
  END IF;

  -- 9. Record Audit Log
  INSERT INTO audit_logs (
    clinic_id, user_id, action, module, record_id, description, metadata
  ) VALUES (
    v_clinic_id, v_cashier_id, 'CREATE_INVOICE', 'POS', v_new_invoice_id::TEXT,
    'Completed POS Sale ' || v_invoice_number || ' for patient ' || v_patient_id::TEXT,
    jsonb_build_object('total', v_grand_total, 'paid', v_total_paid, 'balance', v_balance_due)
  );

  RETURN jsonb_build_object(
    'success', true,
    'invoice_id', v_new_invoice_id,
    'invoice_number', v_invoice_number,
    'total_amount', v_grand_total,
    'paid_amount', v_total_paid,
    'balance_due', v_balance_due,
    'status', v_status
  );
END;
$$;
