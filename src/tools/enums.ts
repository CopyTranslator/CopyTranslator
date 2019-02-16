enum TranslatorType {
  Google,
  Youdao,
  Baidu
}

enum FrameMode {
  Contrast,
  Focus
}

enum YoudaoStatus {
  Success,
  Fail
}

enum MessageType {
  WindowOpt,
  TranslateResult,
  OpenMenu,
  Router
}

enum WinOpt {
  Minify,
  Drag,
  Resize,
  Zoom,
  OpenExternal,
  ChangeColor
}

enum ColorStatus {
  Listen = "green",
  Translating = "yellow",
  AutoCopy = "blue",
  Incremental = "purple",
  None = "none"
}

export {
  TranslatorType,
  FrameMode,
  YoudaoStatus,
  ColorStatus,
  MessageType,
  WinOpt
};
