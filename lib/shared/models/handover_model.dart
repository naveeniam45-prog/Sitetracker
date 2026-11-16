class HandoverModel {
  final String id;
  final String toolId;
  final String toolName;
  final String variant;
  final String fromWorkerName;
  final String toWorkerId;
  final String toWorkerName;
  final String siteName;
  final String status; // 'Pending' | 'Accepted' | 'Declined'
  final String requestDate;
  final String? acceptedDate;

  const HandoverModel({
    required this.id,
    required this.toolId,
    required this.toolName,
    required this.variant,
    required this.fromWorkerName,
    required this.toWorkerId,
    required this.toWorkerName,
    required this.siteName,
    required this.status,
    required this.requestDate,
    this.acceptedDate,
  });

  HandoverModel copyWith({
    String? status,
    String? acceptedDate,
  }) {
    return HandoverModel(
      id: id,
      toolId: toolId,
      toolName: toolName,
      variant: variant,
      fromWorkerName: fromWorkerName,
      toWorkerId: toWorkerId,
      toWorkerName: toWorkerName,
      siteName: siteName,
      status: status ?? this.status,
      requestDate: requestDate,
      acceptedDate: acceptedDate ?? this.acceptedDate,
    );
  }
}
