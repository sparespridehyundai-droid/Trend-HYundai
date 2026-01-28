
export interface Part {
  partNo: string;
  partName: string;
  location: string;
  onHand: number;
  dueIn: number;
  onOrder: number;
  amd3: number;
  mav: number;
  stkEff: number;
  sysGenStock: number;
}

export interface Order {
  id: string;
  timestamp: string;
  userName: string;
  vehicleNumber: string;
  orderType: 'Urgent' | 'Stock' | 'VOR' | 'Accessories';
  partNo: string;
  partName: string;
  location: string;
  quantity: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

export interface User {
  id: string;
  userName: string;
  role: 'Admin' | 'User';
}
