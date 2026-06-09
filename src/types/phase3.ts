// ==========================================
// WMS
// ==========================================
export type ItemGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'E';
export type ItemSource = 'purchased' | 'production' | 'depot_transfer';

export interface TraceEntry {
  id: string;
  itemId: string;
  itemName: string;
  action: 'receive' | 'issue' | 'transfer' | 'qc_pass' | 'qc_reject' | 'adjust' | 'produce';
  personName: string;
  personRole?: string;
  timestamp: string;
  qty: number;
  balanceAfter: number;
  location: string;
  notes?: string;
}

export interface Item {
  id: string; code: string; name: string; category: 'raw_material' | 'semi_finished' | 'finished_goods' | 'spare_parts' | 'consumables' | 'tools' | 'chemicals' | 'safety_equipment';
  subCategory: string; unit: string; brand?: string; model?: string; partNumber?: string; barcode?: string;
  minStock: number; maxStock: number; reorderPoint: number; leadTime: number; shelfLife?: number;
  currentStock: number; reservedStock: number; availableStock: number; unitCost: number; totalValue: number;
  warehouseId: string; locationCode: string; status: 'active' | 'inactive' | 'blocked' | 'near_expiry' | 'expired';
  lastReceived?: string; lastIssued?: string; expiryDate?: string;
  grade: ItemGrade;
  source: ItemSource;
  traceLog: TraceEntry[];
  qrData: string;
}
export interface GRN {
  id: string; grnNumber: string; supplierId: string; supplierName: string; poNumber?: string;
  vehiclePlate?: string; driverName?: string; receivedDate: string; totalItems: number;
  inspectorId: string; inspectorName: string; status: 'pending_qc' | 'approved' | 'rejected' | 'partial';
  items: { itemId: string; itemName: string; orderedQty: number; receivedQty: number; acceptedQty: number; rejectedQty: number; locationCode: string }[];
}
export interface StockTransfer {
  id: string; transferNumber: string; fromWarehouse: string; toWarehouse: string; reason: string;
  items: { itemId: string; itemName: string; qty: number }[];
  requestedBy: string; approvedBy?: string; status: 'pending' | 'approved' | 'in_transit' | 'completed';
  requestDate: string; completedDate?: string;
}
export interface StockIssue {
  id: string; issueNumber: string; requesterId: string; requesterName: string; department: string;
  itemId: string; itemName: string; qty: number; workOrderId?: string;
  approvedBy?: string; status: 'pending' | 'approved' | 'issued' | 'rejected';
  requestDate: string; issueDate?: string;
}

// ==========================================
// SRM
// ==========================================
export interface Supplier {
  id: string; code: string; name: string; nationalId?: string; economicCode?: string;
  contactPerson: string; phone: string; email: string; website?: string;
  address: string; city: string; bankName?: string; bankAccount?: string;
  category: string; rating: number; qualityScore: number; deliveryScore: number; priceScore: number;
  status: 'active' | 'inactive' | 'blacklisted' | 'pending';
  totalOrders: number; totalValue: number; onTimeRate: number;
}
export interface PurchaseRequest {
  id: string; prNumber: string; departmentId: string; departmentName: string;
  requesterId: string; requesterName: string; priority: 'critical' | 'high' | 'medium' | 'low';
  items: { itemId: string; itemName: string; qty: number; unit: string; estimatedCost: number; reason: string }[];
  totalEstimate: number; status: 'draft' | 'pending' | 'approved' | 'rejected' | 'ordered';
  approvedBy?: string; requestDate: string; notes?: string;
}
export interface PurchaseOrder {
  id: string; poNumber: string; supplierId: string; supplierName: string; prId?: string;
  items: { itemId: string; itemName: string; qty: number; unit: string; unitPrice: number; totalPrice: number; deliveryDate: string }[];
  subtotal: number; tax: number; discount: number; totalAmount: number; currency: string;
  paymentTerms: string; deliveryTerms: string;
  status: 'draft' | 'sent' | 'confirmed' | 'partial_received' | 'received' | 'cancelled';
  createdDate: string; expectedDelivery: string;
}

// ==========================================
// CMMS + EAM
// ==========================================
export interface Asset {
  id: string; code: string; name: string; category: string; manufacturer: string; model: string;
  serialNumber: string; installDate: string; warrantyExpiry?: string;
  departmentId: string; departmentName: string; lineId?: string; lineName?: string;
  parentAssetId?: string; criticality: 'critical' | 'high' | 'medium' | 'low';
  status: 'running' | 'stopped' | 'maintenance' | 'decommissioned';
  healthScore: number; mtbf: number; mttr: number; totalDowntime: number; maintenanceCost: number;
  lastPM?: string; nextPM?: string; pmFrequency?: string;
}
export interface WorkOrder {
  id: string; woNumber: string; assetId: string; assetName: string;
  type: 'preventive' | 'corrective' | 'predictive' | 'emergency' | 'inspection' | 'calibration';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string; description: string;
  assignedTeam: string; technicianId?: string; technicianName?: string;
  estimatedHours: number; actualHours?: number;
  spareParts: { partId: string; partName: string; qty: number; cost: number }[];
  laborCost: number; partsCost: number; totalCost: number;
  status: 'open' | 'assigned' | 'in_progress' | 'pending_parts' | 'completed' | 'cancelled';
  plannedDate: string; startedAt?: string; completedAt?: string;
  checklist: { text: string; done: boolean }[];
  failureCode?: string; rootCause?: string; repairAction?: string;
}
export interface PMSchedule {
  id: string; assetId: string; assetName: string; frequency: string; frequencyDays: number;
  checklist: string[]; estimatedTime: number; assignedTeam: string;
  lastExecuted?: string; nextDue: string; status: 'active' | 'overdue' | 'inactive';
}

// ==========================================
// QMS
// ==========================================
export interface Inspection {
  id: string; inspectionNumber: string; type: 'incoming' | 'in_process' | 'final' | 'supplier';
  entityType: string; entityId: string; entityName: string;
  batchNumber?: string; lineId?: string; lineName?: string;
  inspectorId: string; inspectorName: string;
  parameters: InspectionParam[];
  result: 'pass' | 'fail' | 'conditional' | 'pending';
  totalChecks: number; passedChecks: number; failedChecks: number;
  photos: string[]; notes?: string; inspectionDate: string;
}
export interface InspectionParam {
  id: string; name: string; type: 'numeric' | 'text' | 'pass_fail' | 'dropdown';
  unit?: string; min?: number; max?: number; target?: number; tolerance?: number;
  actualValue?: number | string; result?: 'pass' | 'fail';
  required: boolean;
}
export interface NCR {
  id: string; ncrNumber: string; productName: string; batchNumber: string;
  defectType: string; severity: 'minor' | 'major' | 'critical';
  qty: number; description: string; photos: string[];
  reportedBy: string; reportedDate: string;
  disposition: 'rework' | 'scrap' | 'use_as_is' | 'return' | 'pending';
  capaId?: string; status: 'open' | 'investigating' | 'closed';
  cost: number;
}
export interface CAPA {
  id: string; capaNumber: string; type: 'corrective' | 'preventive';
  issueDescription: string; rootCause: string;
  ncrId?: string; sourceType: string;
  actions: { description: string; owner: string; dueDate: string; status: 'open' | 'in_progress' | 'completed'; completedDate?: string }[];
  effectiveness?: string; verifiedBy?: string; verifiedDate?: string;
  status: 'open' | 'in_progress' | 'verification' | 'closed';
  createdDate: string;
}

// ==========================================
// LIMS
// ==========================================
export interface Sample {
  id: string; sampleNumber: string; batchNumber: string; productName: string;
  source: 'raw_material' | 'production' | 'finished' | 'warehouse' | 'supplier' | 'customer';
  collectorId: string; collectorName: string; collectionDate: string;
  tests: LabTest[];
  overallResult: 'pass' | 'fail' | 'pending' | 'in_progress';
  coaGenerated: boolean; coaNumber?: string;
  status: 'registered' | 'in_progress' | 'completed' | 'approved' | 'rejected';
}
export interface LabTest {
  id: string; testName: string; method: string; unit: string;
  specification: { min?: number; max?: number; target?: number; tolerance?: number };
  result?: number | string; resultType: 'numeric' | 'text' | 'pass_fail' | 'calculated';
  status: 'pending' | 'in_progress' | 'completed';
  pass?: boolean; testedBy?: string; testedDate?: string;
}
export interface SPCData { sample: number; value: number; ucl: number; lcl: number; cl: number }
