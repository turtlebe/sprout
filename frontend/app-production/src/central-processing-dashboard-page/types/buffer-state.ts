export interface BufferState {
  buffer_position: number;
  carrier_id: string;
  next_destination?: string;
  final_destination?: string;
  tower_id?: string;
  carrier_type: string;
  crop?: string;
  tower_labels?: string[];
}
