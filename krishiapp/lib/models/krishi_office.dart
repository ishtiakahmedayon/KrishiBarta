class KrishiOffice {
  final int id;
  final String name;
  final String district;
  final String address;
  final String phone;
  final String services;

  KrishiOffice({
    required this.id,
    required this.name,
    required this.district,
    required this.address,
    required this.phone,
    required this.services,
  });

  factory KrishiOffice.fromJson(Map<String, dynamic> json) {
    return KrishiOffice(
      id: json['id'] as int,
      name: json['name'] as String,
      district: json['district'] as String,
      address: json['address'] as String,
      phone: json['phone'] as String,
      services: json['services'] as String,
    );
  }
}
