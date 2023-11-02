heartFinalVert = gemVert

replaceNeededHeartFinalFrag = `



---consts---

---replace---

${other_funcs}

---set_color---

${main_func_txt}
`;

function makeHeartReplacements(){
  heartFinalFrag = replaceNeededHeartFinalFrag.replace("---replace---",  heart_get_normal_func)
  heartFinalFrag = heartFinalFrag.replace("---consts---", consts)
  heartFinalFrag = heartFinalFrag.replace("---set_color---", set_color_func_text)
}
makeHeartReplacements();
