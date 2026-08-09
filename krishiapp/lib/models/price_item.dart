class PriceItem {
  final int id;
  final String name;
  final String namePossessive;
  final double price;
  final String unit;
  final String category;

  PriceItem({
    required this.id,
    required this.name,
    required this.namePossessive,
    required this.price,
    required this.unit,
    required this.category,
  });

  factory PriceItem.fromJson(Map<String, dynamic> json) {
    return PriceItem(
      id: json['id'] as int,
      name: json['name'] as String,
      namePossessive: json['name_possessive'] as String,
      price: (json['price'] as num).toDouble(),
      unit: json['unit'] as String,
      category: json['category'] as String? ?? 'সবজি',
    );
  }
}
