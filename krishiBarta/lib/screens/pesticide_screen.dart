import 'package:flutter/material.dart';
import '../models/pesticide_item.dart';
import '../services/api_service.dart';
import '../services/tts_service.dart';
import '../widgets/error_view.dart';
import '../widgets/mic_button.dart';
import '../widgets/chat_fab.dart';

/// কীটনাশক তথ্য — shows pesticide info per crop and pest.
class PesticideScreen extends StatefulWidget {
  const PesticideScreen({super.key});

  @override
  State<PesticideScreen> createState() => _PesticideScreenState();
}

class _PesticideScreenState extends State<PesticideScreen> {
  List<PesticideItem> _allItems = [];
  List<PesticideItem> _filteredItems = [];
  List<String> _crops = ['সব'];
  String _selectedCrop = 'সব';
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
      final items = await ApiService.instance.getAllPesticides();
      final crops = await ApiService.instance.getPesticideCrops();
      setState(() {
        _allItems = items;
        _crops = ['সব', ...crops];
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
    final query = _searchCtrl.text.trim();
    setState(() {
      _filteredItems = _allItems.where((item) {
        final matchCrop =
            _selectedCrop == 'সব' || item.crop == _selectedCrop;
        final matchQuery = query.isEmpty ||
            item.crop.contains(query) ||
            item.pest.contains(query) ||
            item.pesticideName.contains(query);
        return matchCrop && matchQuery;
      }).toList();
    });
  }

  String _buildTtsText() {
    if (_filteredItems.isEmpty) return 'কোনো তথ্য পাওয়া যায়নি।';
    final buf = StringBuffer('কীটনাশক তথ্য। ');
    for (final item in _filteredItems) {
      buf.write(
          '${item.crop} ফসলে ${item.pest} পোকার জন্য '
          '${item.pesticideName} ব্যবহার করুন। '
          'মাত্রা: ${item.dosage}। '
          'সতর্কতা: ${item.precaution}। ');
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('কীটনাশক'),
        centerTitle: true,
        backgroundColor: const Color(0xFFE65100),
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
                    // Search + mic
                    Padding(
                      padding: const EdgeInsets.fromLTRB(12, 10, 12, 4),
                      child: Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _searchCtrl,
                              onChanged: (_) => _applyFilter(),
                              decoration: InputDecoration(
                                hintText: 'ফসল বা পোকার নাম লিখুন বা বলুন...',
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
                            color: const Color(0xFFE65100),
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
                    // Crop filter chips
                    SizedBox(
                      height: 44,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        padding:
                            const EdgeInsets.symmetric(horizontal: 12),
                        itemCount: _crops.length,
                        itemBuilder: (context, i) {
                          final crop = _crops[i];
                          final selected = crop == _selectedCrop;
                          return Padding(
                            padding: const EdgeInsets.only(
                                right: 8, top: 6, bottom: 6),
                            child: ChoiceChip(
                              label: Text(crop),
                              selected: selected,
                              selectedColor: Colors.orange.shade100,
                              onSelected: (_) {
                                setState(() => _selectedCrop = crop);
                                _applyFilter();
                              },
                            ),
                          );
                        },
                      ),
                    ),
                    // List
                    Expanded(
                      child: _filteredItems.isEmpty
                          ? const Center(
                              child: Text('কোনো তথ্য পাওয়া যায়নি'))
                          : RefreshIndicator(
                              onRefresh: _load,
                              child: ListView.builder(
                                padding: const EdgeInsets.fromLTRB(
                                    12, 4, 12, 12),
                                itemCount: _filteredItems.length,
                                itemBuilder: (context, i) {
                                  final item = _filteredItems[i];
                                  return Card(
                                    margin: const EdgeInsets.only(
                                        bottom: 10),
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(14)),
                                    child: Padding(
                                      padding: const EdgeInsets.all(14),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              CircleAvatar(
                                                radius: 18,
                                                backgroundColor: Colors
                                                    .orange
                                                    .withValues(alpha: 0.15),
                                                child: const Icon(
                                                    Icons.eco,
                                                    color: Colors.orange,
                                                    size: 18),
                                              ),
                                              const SizedBox(width: 10),
                                              Expanded(
                                                child: Text(
                                                  '${item.crop} — ${item.pest}',
                                                  style: const TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      fontSize: 15),
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 10),
                                          _row(
                                              Icons.medication_outlined,
                                              'কীটনাশক',
                                              item.pesticideName,
                                              Colors.green),
                                          const SizedBox(height: 6),
                                          _row(
                                              Icons.science_outlined,
                                              'মাত্রা',
                                              item.dosage,
                                              Colors.blue),
                                          const SizedBox(height: 6),
                                          _row(
                                              Icons.warning_amber_rounded,
                                              'সতর্কতা',
                                              item.precaution,
                                              Colors.deepOrange),
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

  Widget _row(
      IconData icon, String label, String value, Color color) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16, color: color),
        const SizedBox(width: 6),
        Text('$label: ',
            style: TextStyle(
                fontSize: 13,
                color: color,
                fontWeight: FontWeight.w600)),
        Expanded(child: Text(value, style: const TextStyle(fontSize: 13))),
      ],
    );
  }
}
