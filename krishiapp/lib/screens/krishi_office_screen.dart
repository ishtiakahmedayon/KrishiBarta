import 'package:flutter/material.dart';
import '../models/krishi_office.dart';
import '../services/api_service.dart';
import '../services/tts_service.dart';
import '../widgets/error_view.dart';
import '../widgets/mic_button.dart';
import '../widgets/chat_fab.dart';

/// কৃষি অফিস তথ্য — shows agricultural office info filterable by district.
class KrishiOfficeScreen extends StatefulWidget {
  const KrishiOfficeScreen({super.key});

  @override
  State<KrishiOfficeScreen> createState() => _KrishiOfficeScreenState();
}

class _KrishiOfficeScreenState extends State<KrishiOfficeScreen> {
  List<KrishiOffice> _allOffices = [];
  List<KrishiOffice> _filtered = [];
  List<String> _districts = ['সব'];
  String _selectedDistrict = 'সব';
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
      final offices = await ApiService.instance.getAllOffices();
      final districts = await ApiService.instance.getOfficeDistricts();
      setState(() {
        _allOffices = offices;
        _districts = ['সব', ...districts];
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
      _filtered = _allOffices.where((o) {
        final matchDist = _selectedDistrict == 'সব' ||
            o.district == _selectedDistrict;
        final matchQuery = query.isEmpty ||
            o.name.contains(query) ||
            o.district.contains(query);
        return matchDist && matchQuery;
      }).toList();
    });
  }

  String _buildTtsText() {
    if (_filtered.isEmpty) return 'কোনো অফিস পাওয়া যায়নি।';
    final buf = StringBuffer('কৃষি অফিস তালিকা। ');
    for (final o in _filtered) {
      buf.write(
          '${o.name}। জেলা: ${o.district}। '
          'ঠিকানা: ${o.address}। '
          'ফোন: ${o.phone}। '
          'সেবাসমূহ: ${o.services}। ');
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
        title: const Text('কৃষি অফিস'),
        centerTitle: true,
        backgroundColor: const Color(0xFF00695C),
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
                                hintText: 'অফিস বা জেলার নাম লিখুন বা বলুন...',
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
                            color: const Color(0xFF00695C),
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
                    // District chips
                    SizedBox(
                      height: 44,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        padding:
                            const EdgeInsets.symmetric(horizontal: 12),
                        itemCount: _districts.length,
                        itemBuilder: (context, i) {
                          final dist = _districts[i];
                          final selected = dist == _selectedDistrict;
                          return Padding(
                            padding: const EdgeInsets.only(
                                right: 8, top: 6, bottom: 6),
                            child: ChoiceChip(
                              label: Text(dist),
                              selected: selected,
                              selectedColor: Colors.teal.shade100,
                              onSelected: (_) {
                                setState(
                                    () => _selectedDistrict = dist);
                                _applyFilter();
                              },
                            ),
                          );
                        },
                      ),
                    ),
                    // List
                    Expanded(
                      child: _filtered.isEmpty
                          ? const Center(
                              child: Text('কোনো অফিস পাওয়া যায়নি'))
                          : RefreshIndicator(
                              onRefresh: _load,
                              child: ListView.builder(
                                padding: const EdgeInsets.fromLTRB(
                                    12, 4, 12, 12),
                                itemCount: _filtered.length,
                                itemBuilder: (context, i) {
                                  final office = _filtered[i];
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
                                                    .teal
                                                    .withValues(alpha: 0.15),
                                                child: const Icon(
                                                    Icons.business,
                                                    color: Colors.teal,
                                                    size: 18),
                                              ),
                                              const SizedBox(width: 10),
                                              Expanded(
                                                child: Text(
                                                  office.name,
                                                  style: const TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      fontSize: 15),
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 10),
                                          _infoRow(Icons.map_outlined,
                                              'জেলা', office.district,
                                              Colors.teal),
                                          const SizedBox(height: 5),
                                          _infoRow(
                                              Icons.location_on_outlined,
                                              'ঠিকানা',
                                              office.address,
                                              Colors.green),
                                          const SizedBox(height: 5),
                                          _infoRow(Icons.phone_outlined,
                                              'ফোন', office.phone,
                                              Colors.blue),
                                          const SizedBox(height: 8),
                                          Container(
                                            padding:
                                                const EdgeInsets.all(10),
                                            decoration: BoxDecoration(
                                              color: Colors.teal
                                                  .withValues(alpha: 0.06),
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                const Text(
                                                  '📋 সেবাসমূহ:',
                                                  style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.w600,
                                                      fontSize: 13,
                                                      color: Colors.teal),
                                                ),
                                                const SizedBox(height: 4),
                                                ...office.services
                                                    .split(',')
                                                    .map((s) => Padding(
                                                          padding:
                                                              const EdgeInsets
                                                                  .only(
                                                                  top: 2),
                                                          child: Row(
                                                            crossAxisAlignment:
                                                                CrossAxisAlignment
                                                                    .start,
                                                            children: [
                                                              const Text(
                                                                  '• ',
                                                                  style: TextStyle(
                                                                      color: Colors
                                                                          .teal)),
                                                              Expanded(
                                                                  child: Text(
                                                                      s.trim(),
                                                                      style: const TextStyle(
                                                                          fontSize:
                                                                              13))),
                                                            ],
                                                          ),
                                                        )),
                                              ],
                                            ),
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

  Widget _infoRow(
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
        Expanded(
            child: Text(value, style: const TextStyle(fontSize: 13))),
      ],
    );
  }
}
