class PesticideItem {
  final int id;
  final String crop;
  final String pest;
  final String pesticideName;
  final String dosage;
  final String precaution;

  PesticideItem({
    required this.id,
    required this.crop,
    required this.pest,
    required this.pesticideName,
    required this.dosage,
    required this.precaution,
  });

  factory PesticideItem.fromJson(Map<String, dynamic> json) {
    return PesticideItem(
      id: json['id'] as int,
      crop: json['crop'] as String,
      pest: json['pest'] as String,
      pesticideName: json['pesticide_name'] as String,
      dosage: json['dosage'] as String,
      precaution: json['precaution'] as String,
    );
  }
}
