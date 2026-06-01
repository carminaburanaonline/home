function textWidth(text, context) {
  return context.measureText(text).width * 16 / 14;
}

export function setLeadingConsonants(container) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  container.querySelectorAll(".neumed-syll").forEach(syll => {
    const consonants = syll.querySelector(".syl-text").textContent.split(/[aeiouAEIOUyYůöǒêœî].*/)[0];
    if (consonants.length) {
      const padding = textWidth(consonants, context);
      syll.querySelectorAll(".neumes").forEach(x => {
        x.style.paddingLeft = padding + "px";
      });
    }
  });
}