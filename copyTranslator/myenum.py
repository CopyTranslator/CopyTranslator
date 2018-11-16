# -*- coding: utf-8 -*-
# @Time    : 2018/10/12 0012 0:35
# @FileName: myenum.py
# @Software: PyCharm

from enum import Enum


class FrameMode:
    main = 'Main Mode'
    focus = 'Focus Mode'
    writing = 'Writing Mode'


class TranslatorType:
    GOOGLE = 0
    SOGOU = 1
    YOUDAO = 2


class Language(Enum):
    AR = 'ar'  # Arabic
    AUTO = 'auto'  # Arabic
    ET = 'et'  # Estonian
    BG = 'bg'  # Bulgarian
    PL = 'pl'  # Polish
    KO = 'ko'  # Korean
    BS_LATN = 'bs-Latn'  # Bosnian (Latin)
    FA = 'fa'  # Persian
    MWW = 'mww'  # Hmong Daw
    DA = 'da'  # Danish
    DE = 'de'  # German
    RU = 'ru'  # Russian
    FR = 'fr'  # French
    FI = 'fi'  # Finnish
    TLH_QAAK = 'tlh-Qaak'  # Klingon (pIqaD)
    TLH = 'tlh'  # Klingon
    HR = 'hr'  # Croatian
    OTQ = 'otq'  # Querétaro Otomi
    CA = 'ca'  # Catalan
    CS = 'cs'  # Czech
    RO = 'ro'  # Romanian
    LV = 'lv'  # Latvian
    HT = 'ht'  # Haitian Creole
    LT = 'lt'  # Lithuanian
    NL = 'nl'  # Dutch
    MS = 'ms'  # Malay
    MT = 'mt'  # Maltese
    PT = 'pt'  # Portuguese
    JA = 'ja'  # Japanese
    SL = 'sl'  # Slovenian
    TH = 'th'  # Thai
    TR = 'tr'  # Turkish
    SR_LATN = 'sr-Latn'  # Serbian (Latin)
    SR_CYRL = 'sr-Cyrl'  # Serbian (Cyrillic)
    SK = 'sk'  # Slovak
    SW = 'sw'  # Kiswahili
    AF = 'af'  # South African Common Dutch
    NO = 'no'  # Norwegian
    EN = 'en'  # English
    ES = 'es'  # Spanish
    UK = 'uk'  # Ukrainian
    UR = 'ur'  # Urdu
    EL = 'el'  # Greek
    HU = 'hu'  # Hungarian
    CY = 'cy'  # Welsh
    YUA = 'yua'  # Yucatec Maya
    HE = 'he'  # Hebrew
    ZH_CHS = 'zh-CHS'  # Chinese Simplified
    IT = 'it'  # Italian
    HI = 'hi'  # Hindi
    ID = 'id'  # Indonesian
    ZH_CHT = 'zh-CHT'  # Chinese Traditional
    VI = 'vi'  # Vietnamese
    SV = 'sv'  # Swedish
    YUE = 'yue'  # Cantonese
    FJ = 'fj'  # fijian
    FIL = 'fil'  # Filipino
    SM = 'sm'  # Samoan language
    TO = 'to'  # lea fakatonga
    TY = 'ty'  # Tahiti language
    MG = 'mg'  # Malagasy language
    BN = 'bn'  # Bengali
