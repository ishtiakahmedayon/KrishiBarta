import 'package:flutter/material.dart';
import '../models/price_item.dart';
import '../services/api_service.dart';
import '../services/tts_service.dart';
import '../utils/bangla_numbers.dart';
import '../widgets/error_view.dart';
import '../widgets/mic_button.dart';
import '../widgets/chat_fab.dart';

/// সবজির দাম — shows current vegetable/product prices grouped by category.
class PriceScreen extends StatefulWidget {
  const PriceScreen({super.key});

  @override
  State<PriceScreen> createState() => _PriceScreenState();
}

class _PriceScreenState extends State<PriceScreen> {
  List<PriceItem> _allItems = [];
  List<PriceItem> _filteredItems = [];
  List<String> _categories = ['সব'];
  String _selectedCategory = 'সব';
  bool _loading = true;
  String? _error;
  bool _speaking = false;
  final _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    TtsService.instance.stop();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final items = await ApiService.instance.getAllPrices();
      final cats = await ApiService.instance.getPriceCategories();
      setState(() {
        _allItems = items;
        _categories = ['সব', ...cats];
        _loading = false;
      });
      _applyFilter();
    } catch (e) {
      setState(() {
        _loading = false;
        _error = 'তথ্য লোড করতে সমস্যা হয়েছে।\n${e.toString()}';
      });
    }
  }

  void _applyFilter() {
    final query = _searchCtrl.text.trim().toLowerCase();
    setState(() {
      _filteredItems = _allItems.where((item) {
        final matchCat =
            _selectedCategory == 'সব' || item.category == _selectedCategory;
        final matchQuery = query.isEmpty || item.name.contains(query);
        return matchCat && matchQuery;
      }).toList();
    });
  }

  String _buildTtsText() {
    if (_filteredItems.isEmpty) return 'কোনো পণ্য পাওয়া যায়নি।';
    final buf = StringBuffer('সবজির দামের তালিকা। ');
    for (final item in _filteredItems) {
      final unit = speakableUnit(item.unit);
      final unitPhrase = unit.isNotEmpty ? 'প্রতি $unit ' : '';
      buf.write(
          '${item.name} $unitPhrase${formatPriceBangla(item.price)} টাকা। ');
    }
    return buf.toString();
  }

  Future<void> _toggleTts() async {
    if (_speaking) {
      await TtsService.instance.stop();
      setState(() => _speaking = false);
    } else {
      setState(() => _speaking = true);
      await TtsService.instance.speak(_buildTtsText());
      if (mounted) setState(() => _speaking = false);
    }
  }

  Color _categoryColor(String cat) {
    switch (cat) {
      case 'সবজি':
        return Colors.green;
      case 'মশলা':
        return Colors.orange;
      case 'শস্য':
        return Colors.amber.shade700;
      default:
        return Colors.teal;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('সবজির দাম'),
        centerTitle: true,
        backgroundColor: const Color(0xFF2E7D32),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (!_loading && _error == null)
            IconButton(
              tooltip: _speaking ? 'পড়া বন্ধ করুন' : 'পড়ে শোনান',
              icon: Icon(_speaking ? Icons.stop_circle : Icons.volume_up),
              onPressed: _toggleTts,
            ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? ErrorView(message: _error!, onRetry: _load)
              : Column(
                  children: [
                    // Search bar + mic
                    Padding(
                      padding: const EdgeInsets.fromLTRB(12, 10, 12, 4),
                      child: Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _searchCtrl,
                              onChanged: (_) => _applyFilter(),
                              decoration: InputDecoration(
                                hintText: 'পণ্য খুঁজুন বা মাইকে বলুন...',
                                prefixIcon: const Icon(Icons.search),
                                isDense: true,
                                border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12)),
                                filled: true,
                                fillColor: Colors.grey.shade100,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          MicButton(
                            color: const Color(0xFF2E7D32),
                            onResult: (text) {
                              _searchCtrl.text = text;
                              _applyFilter();
                            },
                            onDone: () {
                              if (!_speaking) _toggleTts();
                            },
                          ),
                        ],
                      ),
                    ),
                    // Category filter chips
                    SizedBox(
                      height: 44,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        padding:
                            const EdgeInsets.symmetric(horizontal: 12),
                        itemCount: _categories.length,
                        itemBuilder: (context, i) {
                          final cat = _categories[i];
                          final selected = cat == _selectedCategory;
                          return Padding(
                            padding: const EdgeInsets.only(
                                right: 8, top: 6, bottom: 6),
                            child: ChoiceChip(
                              label: Text(cat),
                              selected: selected,
                              onSelected: (_) {
                                setState(
                                    () => _selectedCategory = cat);
                                _applyFilter();
                              },
                            ),
                          );
                        },
                      ),
                    ),
                    // Price list
                    Expanded(
                      child: _filteredItems.isEmpty
                          ? const Center(
                              child: Text('কোনো পণ্য পাওয়া যায়নি'))
                          : RefreshIndicator(
                              onRefresh: _load,
                              child: ListView.builder(
                                padding: const EdgeInsets.fromLTRB(
                                    12, 4, 12, 12),
                                itemCount: _filteredItems.length,
                                itemBuilder: (context, i) {
                                  final item = _filteredItems[i];
                                  final color =
                                      _categoryColor(item.category);
                                  return Card(
                                    margin: const EdgeInsets.only(
                                        bottom: 8),
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(12)),
                                    child: ListTile(
                                      leading: CircleAvatar(
                                        backgroundColor: color
                                            .withValues(alpha: 0.15),
                                        child: Icon(Icons.eco,
                                            color: color, size: 20),
                                      ),
                                      title: Text(
                                        item.name,
                                        style: const TextStyle(
                                            fontWeight:
                                                FontWeight.w600),
                                      ),
                                      subtitle: Text(item.category),
                                      trailing: Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.end,
                                        children: [
                                          Text(
                                            '৳ ${formatPriceBangla(item.price)}',
                                            style: TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                              color: color,
                                            ),
                                          ),
                                          Text(
                                            item.unit,
                                            style: const TextStyle(
                                                fontSize: 11,
                                                color: Colors.grey),
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                    ),
                  ],
                ),
      floatingActionButton: const ChatFab(),
    );
  }
}
