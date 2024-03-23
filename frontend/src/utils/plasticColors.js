function hasWhiteSpace(s) {
  return /\s/.test(s);
}

export function transformText(text) {
  // Split the text by space and join with '-'
  if (text && hasWhiteSpace(text)) {
    const transformedText = text.split(" ").join("-").toLowerCase();
    return transformedText;
  }
  return text?.toLowerCase();
}
