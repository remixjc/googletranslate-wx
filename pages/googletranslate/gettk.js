 function b(a, b) {
    for (var d = 0; d < b.length - 2; d += 3) {
      var c = b.charAt(d + 2),
        c = "a" <= c ? c.charCodeAt(0) - 87 : Number(c),
        c = "+" == b.charAt(d + 1) ? a >>> c : a << c;
      a = "+" == b.charAt(d) ? a + c & 4294967295 : a ^ c
    }
    return a
  }

function tk(a, TKK) {
    for (var e = TKK.split("."), h = Number(e[0]) || 0, g = [], d = 0, f = 0; f < a.length; f++) {
      var c = a.charCodeAt(f);
      128 > c ? g[d++] = c : (2048 > c ? g[d++] = c >> 6 | 192 : (55296 == (c & 64512) && f + 1 < a.length && 56320 == (a.charCodeAt(f + 1) & 64512) ? (c = 65536 + ((c & 1023) << 10) + (a.charCodeAt(++f) & 1023), g[d++] = c >> 18 | 240, g[d++] = c >> 12 & 63 | 128) : g[d++] = c >> 12 | 224, g[d++] = c >> 6 & 63 | 128), g[d++] = c & 63 | 128)
    }
    a = h;
    for (d = 0; d < g.length; d++) a += g[d], a = b(a, "+-a^+6");
    a = b(a, "+-3^+b+-f");
    a ^= Number(e[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return a.toString() + "." + (a ^ h)
  }

  function loadData(tkk){
    if (tkk != '') {
      var tk = tool.tk(this.data.fr, this.data.tkk);
      console.log(this.data.frLang);
      console.log('tkk:' + this.data.tkk + ',tk:' + tk + ',frLang:' + this.data.frLang + ',toLang:' + this.data.toLang);
      //var googleTransUrl = "https://translate.google.cn/translate_a/single?client=t&sl=" + this.data.pickrer[index].key + "&tl=" + req.body.tolang + "&hl=en&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&otf=1&ssel=0&tsel=0&kc=1&tk=" + tks + "&q=" + encodeURIComponent(req.body.fr);
      this.setData(
        {
          to: 'tkk:' + this.data.tkk + ',tk:' + tk + ',fr:' + this.data.fr
        }
      );
    }
  }

module.exports = {
  tk:tk,
  loadData:loadData
}