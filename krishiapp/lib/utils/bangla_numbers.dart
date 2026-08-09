const _englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const _banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/// Converts English digits in [input] to Bangla digits.
/// e.g. "50" → "৫০"
String toBanglaDigits(String input) {
  var result = input;
  for (var i = 0; i < _englishDigits.length; i++) {
    result = result.replaceAll(_englishDigits[i], _banglaDigits[i]);
  }
  return result;
}

/// Formats a price as a Bangla numeral string.
/// Whole numbers drop the decimal: 30.0 → ৩০, fractions keep one place: 30.5 → ৩০.৫
String formatPriceBangla(num price) {
  final s = (price == price.roundToDouble())
      ? price.toInt().toString()
      : price.toStringAsFixed(1);
  return toBanglaDigits(s);
}

/// Cleans a unit string (e.g. "টাকা/কেজি", "৳/kg", "kg") down to just the
/// bare measure word for natural Bangla speech — e.g. "কেজি". Strips the
/// currency glyph/word (already said as "টাকা" elsewhere in the sentence,
/// so leaving it in the unit causes TTS to say "taka" twice), converts
/// common English abbreviations to Bangla words, and returns the unit
/// WITHOUT a "প্রতি" (per) prefix — callers add "প্রতি" themselves and
/// should say it *before* the amount, e.g. "প্রতি কেজি ৭৫০ টাকা".
String speakableUnit(String rawUnit) {
  var u = rawUnit.replaceAll('৳', '').replaceAll('/', ' ');
  u = u.replaceAll('টাকা', ''); // avoid saying "taka" twice
  u = u.replaceAll(RegExp(r'\bkg\b', caseSensitive: false), 'কেজি');
  u = u.replaceAll(RegExp(r'\bgm?\b', caseSensitive: false), 'গ্রাম');
  u = u.replaceAll(RegExp(r'\bl(iter)?\b', caseSensitive: false), 'লিটার');
  u = u.replaceAll(RegExp(r'\bpiece(s)?\b|\bpc(s)?\b', caseSensitive: false),
      'টি');
  u = u.replaceAll('প্রতি', ''); // strip any pre-existing "per", we add it once
  u = u.replaceAll(RegExp(r'\s+'), ' ').trim();
  return u;
}
