export type Language = 'ar_fusha' | 'darija_ar' | 'darija_latin';

export interface TranslationDict {
  // Navigation
  site_title: string;
  site_subtitle: string;
  nav_matches: string;
  nav_tournaments: string;
  nav_leaderboard: string;
  nav_admin: string;
  nav_login: string;
  nav_register: string;
  nav_recharge: string;
  nav_balance: string;
  nav_logout: string;
  nav_profile: string;

  // Hero Section
  hero_badge: string;
  hero_title_1: string;
  hero_title_highlight: string;
  hero_title_2: string;
  hero_desc: string;
  hero_btn_create: string;
  hero_btn_recharge: string;
  hero_stat_matches: string;
  hero_stat_prizes: string;
  hero_stat_escrow: string;

  // Live Matches Widget
  live_available: string;
  see_all: string;
  no_open_matches: string;
  create_challenge_btn: string;
  stake: string;
  prize: string;
  accept: string;

  // How it works
  how_title: string;
  how_subtitle: string;
  step1_title: string;
  step1_desc: string;
  step2_title: string;
  step2_desc: string;
  step3_title: string;
  step3_desc: string;
  step4_title: string;
  step4_desc: string;

  // Tournaments
  tourn_title: string;
  tourn_subtitle: string;
  tourn_entry_fee: string;
  tourn_players: string;
  tourn_start: string;
  tourn_details: string;

  // Trust Banner
  escrow_title: string;
  escrow_desc: string;
  escrow_cta: string;

  // Footer
  footer_subtitle: string;
  footer_payment: string;
  footer_escrow: string;
  footer_rights: string;

  // Language names & switcher
  lang_official: string;
  lang_select_title: string;
  lang_darija_latin: string;
  lang_darija_ar: string;
  lang_ar_fusha: string;

  // Matches Lobby
  matches_title: string;
  matches_subtitle: string;
  matches_create_btn: string;
  matches_tab_open: string;
  matches_tab_playing: string;
  matches_tab_dispute: string;
  matches_tab_completed: string;
  matches_tab_all: string;
  matches_platform_label: string;
  matches_platform_all: string;
  matches_loading: string;
  matches_empty_title: string;
  matches_empty_desc: string;
  matches_vs: string;
  matches_waiting: string;
  matches_view: string;
  matches_your_match: string;
  matches_join_btn: string;
  matches_enter_room: string;
  matches_insufficient_balance: string;

  // Create Match Modal
  modal_create_title: string;
  modal_create_subtitle: string;
  modal_stake_label: string;
  modal_platform_label: string;
  modal_title_label: string;
  modal_title_placeholder: string;
  modal_prize_calc: string;
  modal_fee_note: string;
  modal_submit_btn: string;
  modal_creating: string;
  modal_recharge_prompt: string;

  // Recharge Modal
  recharge_title: string;
  recharge_subtitle: string;
  recharge_tab_new: string;
  recharge_tab_history: string;
  recharge_select_amount: string;
  recharge_other_amount: string;
  recharge_method: string;
  recharge_admin_info: string;
  recharge_your_whatsapp: string;
  recharge_notes: string;
  recharge_notes_ph: string;
  recharge_submit: string;
  recharge_sending: string;
  recharge_success_title: string;
  recharge_request_num: string;
  recharge_amount: string;
  recharge_status_pending: string;
  recharge_status_approved: string;
  recharge_status_rejected: string;
  recharge_whatsapp_btn: string;
  recharge_whatsapp_note: string;
  recharge_back: string;
  recharge_history_empty: string;
  recharge_history_loading: string;

  // Tournaments Page
  tourn_page_title: string;
  tourn_page_subtitle: string;
  tourn_admin_manage: string;
  tourn_total_prize: string;
  tourn_places: string;
  tourn_format: string;
  tourn_knockout: string;
  tourn_distribution: string;
  tourn_joined_already: string;
  tourn_register_btn: string;
  tourn_registering: string;

  // Leaderboard Page
  lead_page_title: string;
  lead_page_subtitle: string;
  lead_admin_manage: string;
  lead_rank: string;
  lead_player: string;
  lead_efootball_id: string;
  lead_wins: string;
  lead_losses: string;
  lead_win_rate: string;
  lead_loading: string;

  // Profile Page
  prof_admin_super: string;
  prof_admin_desc: string;
  prof_admin_panel: string;
  prof_wallet_title: string;
  prof_available: string;
  prof_recharge: string;
  prof_withdraw: string;
  prof_withdraw_title: string;
  prof_withdraw_amount: string;
  prof_withdraw_method: string;
  prof_withdraw_dest: string;
  prof_withdraw_submit: string;
  prof_transactions_title: string;
  prof_tx_type: string;
  prof_tx_desc: string;
  prof_tx_date: string;
  prof_tx_amount: string;
  prof_tx_balance: string;
  prof_tx_empty: string;
  prof_need_login: string;

  // Auth Pages
  auth_login_title: string;
  auth_login_subtitle: string;
  auth_username_email: string;
  auth_password: string;
  auth_login_submit: string;
  auth_logging_in: string;
  auth_no_account: string;
  auth_register_link: string;
  auth_reg_title: string;
  auth_reg_subtitle: string;
  auth_reg_username: string;
  auth_reg_whatsapp: string;
  auth_reg_email: string;
  auth_reg_pass_hint: string;
  auth_reg_submit: string;
  auth_registering: string;
  auth_have_account: string;
  auth_login_link: string;

  // Match Room Page
  room_back: string;
  room_code_header: string;
  room_code_copy: string;
  room_code_copied: string;
  room_code_save: string;
  room_code_input_prompt: string;
  room_code_waiting_host: string;
  room_host: string;
  room_opponent: string;
  room_waiting_opponent: string;
  room_prize_label: string;
  room_winner_announcement: string;
  room_winner_awarded: string;
  room_cancel_challenge: string;
  room_dispute_banner_title: string;
  room_dispute_banner_desc: string;
  room_submit_result_title: string;
  room_result_sent_badge: string;
  room_who_won: string;
  room_i_won: string;
  room_opponent_won: string;
  room_my_score: string;
  room_screenshot: string;
  room_submit_btn: string;
  room_result_recorded: string;
  room_chat_title: string;
  room_chat_placeholder: string;
  room_chat_empty: string;
  room_chat_only_players: string;
}

export const translations: Record<Language, TranslationDict> = {
  ar_fusha: {
    site_title: 'إي فوتبول أرينا',
    site_subtitle: '1 ضد 1 وبطولات المغرب',
    nav_matches: 'تحديات 1 ضد 1',
    nav_tournaments: 'البطولات الرسمية',
    nav_leaderboard: 'لوحة الصدارة',
    nav_admin: 'لوحة الإدارة',
    nav_login: 'تسجيل الدخول',
    nav_register: 'إنشاء حساب مجاناً',
    nav_recharge: 'شحن المحفظة',
    nav_balance: 'الرصيد',
    nav_logout: 'تسجيل الخروج',
    nav_profile: 'الملف الشخصي',

    hero_badge: 'المنصة الأولى بالمغرب لـ eFootball',
    hero_title_1: 'العب ',
    hero_title_highlight: '1 ضد 1 وبطولات',
    hero_title_2: ' بجوائز نقدية حقيقية!',
    hero_desc: 'تحدّ نخبة اللاعبين في eFootball عبر الهاتف أو منصات الألعاب. اشحن محفظتك يدوياً وبسهولة عبر (CIH Bank أو Cash Plus) واستلم أرباحك بأمان تام 100%.',
    hero_btn_create: 'إنشاء تحدي 1 ضد 1',
    hero_btn_recharge: 'شحن الرصيد (يدوي)',
    hero_stat_matches: 'مباراة مكتملة',
    hero_stat_prizes: 'جوائز موزعة',
    hero_stat_escrow: 'ضمان مالي 100%',

    live_available: 'مباريات متاحة حالياً',
    see_all: 'عرض الكل',
    no_open_matches: 'لا توجد تحديات مفتوحة حالياً، كن أول من ينشئ تحدياً جديداً!',
    create_challenge_btn: 'إنشاء تحدي جديد',
    stake: 'الرهان',
    prize: 'الجائزة',
    accept: 'قبول التحدي',

    how_title: 'كيف تعمل المنصة؟',
    how_subtitle: '4 خطوات بسيطة لشحن الرصيد وبدء خوض المباريات والبطولات',
    step1_title: 'شحن المحفظة (يدوياً)',
    step1_desc: 'اختر المبلغ (20، 50، 100 درهم...) وتواصل مع الإدارة عبر واتساب للتحويل. يضاف الرصيد لمحفظتك فوراً بعد التأكيد.',
    step2_title: 'إنشاء أو قبول التحدي',
    step2_desc: 'حدد قيمة الدخول والمنصة. يتم حجز رصيد الطرفين تلقائياً في نظام الضمان (Escrow) لحماية حقوق الجميع.',
    step3_title: 'تبادل رمز الغرفة في اللعبة',
    step3_desc: 'احصل على رمز الغرفة (Room Code) عبر المحادثة المباشرة، ثم انضم للغرفة في تطبيق eFootball لمدة 10 دقائق.',
    step4_title: 'إرسال النتيجة واستلام الجائزة',
    step4_desc: 'ارفع لقطة شاشة لنتيجة المباراة. يتم تحويل الجائزة تلقائياً لمحفظة الفائز مع إمكانية السحب في أي وقت.',

    tourn_title: 'البطولات الأسبوعية الرسمية',
    tourn_subtitle: 'سجّل في البطولات الكبرى وتنافس على جوائز نقدية قيّمة',
    tourn_entry_fee: 'رسوم الاشتراك',
    tourn_players: 'المشاركون',
    tourn_start: 'موعد الانطلاق',
    tourn_details: 'التفاصيل والتسجيل',

    escrow_title: 'نظام الضمان المالي الآمن (Escrow 100%)',
    escrow_desc: 'يتم تجميد أموال المباراة في المنصة قبل انطلاقها، مما يمنع الانسحاب غير العادل. في حال وجود أي نزاع، تتدخل الإدارة لمراجعة لقطات الشاشة وفصل النتيجة بكل شفافية.',
    escrow_cta: 'اشحن رصيدك الآن',

    footer_subtitle: 'المنصة المغربية الأولى لمباريات 1 ضد 1 والبطولات',
    footer_payment: 'دفع يدوي آمن: CIH Bank و Cash Plus',
    footer_escrow: 'ضمان مالي Escrow 100%',
    footer_rights: 'جميع الحقوق محفوظة',

    lang_official: 'الرسمية',
    lang_select_title: 'اختر اللغة',
    lang_ar_fusha: 'العربية (الرسمية)',
    lang_darija_ar: 'الدارجة المغربية',
    lang_darija_latin: 'الدارجة (Latin)',

    matches_title: 'صالة تحديات 1 ضد 1',
    matches_subtitle: 'اختر تحدياً متاحاً أو أنشئ تحدياً جديداً وانتظر انضمام منافس',
    matches_create_btn: 'إنشاء تحدي جديد',
    matches_tab_open: 'متاح (Open)',
    matches_tab_playing: 'جارية الآن (Playing)',
    matches_tab_dispute: 'نزاع (Dispute)',
    matches_tab_completed: 'مكتملة (Completed)',
    matches_tab_all: 'الكل',
    matches_platform_label: 'المنصة:',
    matches_platform_all: 'جميع المنصات',
    matches_loading: 'جاري تحميل المباريات...',
    matches_empty_title: 'لا توجد مباريات في هذا القسم حالياً',
    matches_empty_desc: 'كن أول من ينشئ تحدياً جديداً الآن!',
    matches_vs: 'ضد',
    matches_waiting: 'بانتظار منافس...',
    matches_view: 'عرض التحدي',
    matches_your_match: 'عرض التحدي الخاص بك',
    matches_join_btn: 'قبول التحدي',
    matches_enter_room: 'دخول غرفة المباراة',
    matches_insufficient_balance: 'رصيدك الحالي غير كافٍ لهذا التحدي.',

    modal_create_title: 'إنشاء تحدي 1 ضد 1',
    modal_create_subtitle: 'أنشئ مباراة وانتظر انضمام لاعب آخر لمنافستك',
    modal_stake_label: 'قيمة الدخول / الرهان (درهم مغربي)',
    modal_platform_label: 'المنصة (الجهاز)',
    modal_title_label: 'عنوان التحدي (اختياري)',
    modal_title_placeholder: 'مثال: تحدي للمحترفين 20 درهم',
    modal_prize_calc: 'الجائزة المحتملة للفائز',
    modal_fee_note: 'خصم المنصة 10% لضمان التحكيم ونظام Escrow',
    modal_submit_btn: 'تأكيد وإنشاء التحدي',
    modal_creating: 'جاري إنشاء التحدي...',
    modal_recharge_prompt: 'رصيدك الحالي غير كافٍ. يرجى شحن المحفظة أولاً.',

    recharge_title: 'شحن المحفظة (Recharge)',
    recharge_subtitle: 'أضف رصيداً لخوض تحديات 1 ضد 1 والبطولات',
    recharge_tab_new: 'طلب شحن جديد',
    recharge_tab_history: 'سجل طلبات الشحن',
    recharge_select_amount: 'اختر المبلغ (درهم مغربي)',
    recharge_other_amount: 'مبلغ آخر...',
    recharge_method: 'طريقة الدفع',
    recharge_admin_info: 'بيانات التحويل الخاصة بالإدارة',
    recharge_your_whatsapp: 'رقم الواتساب الخاص بك (لتأكيد الشحن)',
    recharge_notes: 'ملاحظات إضافية (اختياري)',
    recharge_notes_ph: 'مثال: تحويل باسمي / وصل التحويل...',
    recharge_submit: 'إرسال طلب الشحن',
    recharge_sending: 'جاري إرسال الطلب...',
    recharge_success_title: 'تم تسجيل طلب الشحن بنجاح!',
    recharge_request_num: 'رقم الطلب الخاص بك:',
    recharge_amount: 'المبلغ:',
    recharge_status_pending: 'قيد المراجعة',
    recharge_status_approved: 'تم التأكيد ✓',
    recharge_status_rejected: 'مرفوض ✕',
    recharge_whatsapp_btn: 'تواصل مع الإدارة عبر واتساب الآن',
    recharge_whatsapp_note: 'اضغط على الزر الأخضر لفتح محادثة مباشرة مع الإدارة لتأكيد التحويل وإضافة الرصيد فوراً.',
    recharge_back: 'العودة للمنصة',
    recharge_history_empty: 'لا توجد أي طلبات شحن سابقة في حسابك.',
    recharge_history_loading: 'جاري تحميل السجل...',

    tourn_page_title: 'البطولات الرسمية (Tournaments)',
    tourn_page_subtitle: 'بطولات كبرى بجوائز نقدية حقيقية. قرعة مباشرة ومباريات 10 دقائق.',
    tourn_admin_manage: 'إدارة البطولات (Admin)',
    tourn_total_prize: 'مجموع الجوائز:',
    tourn_places: 'مقاعد',
    tourn_format: 'نظام البطولة',
    tourn_knockout: 'خروج مغلوب مباشر',
    tourn_distribution: 'توزيع الجوائز:',
    tourn_joined_already: 'أنت مسجل بالفعل في هذه البطولة ✓',
    tourn_register_btn: 'التسجيل في البطولة',
    tourn_registering: 'جاري التسجيل...',

    lead_page_title: 'لوحة صدارة الأبطال (Leaderboard)',
    lead_page_subtitle: 'أفضل لاعبي eFootball في المغرب حسب عدد الانتصارات',
    lead_admin_manage: 'إدارة الترتيب (Admin)',
    lead_rank: 'الترتيب',
    lead_player: 'اللاعب',
    lead_efootball_id: 'معرّف eFootball',
    lead_wins: 'الانتصارات',
    lead_losses: 'الهزائم',
    lead_win_rate: 'نسبة الفوز',
    lead_loading: 'جاري تحميل لوحة الصدارة...',

    prof_admin_super: 'حساب الإدارة الرئيسية (Super Admin)',
    prof_admin_desc: 'بصفتك مديراً للمنصة، لديك كامل الصلاحيات لتأكيد طلبات الشحن، السحب، ومراجعة النزاعات.',
    prof_admin_panel: 'الدخول إلى لوحة الإدارة',
    prof_wallet_title: 'محفظة الرصيد (Wallet)',
    prof_available: 'الرصيد المتاح للسحب أو اللعب',
    prof_recharge: 'شحن المحفظة (+)',
    prof_withdraw: 'سحب الأرباح',
    prof_withdraw_title: 'طلب سحب الرصيد (Retrait)',
    prof_withdraw_amount: 'المبلغ المراد سحبه',
    prof_withdraw_method: 'طريقة الاستلام',
    prof_withdraw_dest: 'بيانات الحساب (RIB أو الاسم الكامل ورقم البطاقة CIN)',
    prof_withdraw_submit: 'إرسال طلب السحب',
    prof_transactions_title: 'سجل المعاملات المالية (Historique)',
    prof_tx_type: 'النوع',
    prof_tx_desc: 'الوصف',
    prof_tx_date: 'التاريخ',
    prof_tx_amount: 'المبلغ',
    prof_tx_balance: 'الرصيد بعد العملية',
    prof_tx_empty: 'لا توجد معاملات مسجلة في حسابك حتى الآن.',
    prof_need_login: 'يجب تسجيل الدخول لعرض الملف الشخصي.',

    auth_login_title: 'تسجيل الدخول إلى حسابك',
    auth_login_subtitle: 'العب 1 ضد 1 واشحن رصيدك بكل أمان وسهولة',
    auth_username_email: 'اسم المستخدم أو البريد الإلكتروني',
    auth_password: 'كلمة المرور',
    auth_login_submit: 'تسجيل الدخول',
    auth_logging_in: 'جاري الدخول...',
    auth_no_account: 'ليس لديك حساب بعد؟',
    auth_register_link: 'إنشاء حساب مجاناً',
    auth_reg_title: 'إنشاء حساب جديد',
    auth_reg_subtitle: 'انضم إلى أكبر مجتمع للاعبي eFootball في المغرب',
    auth_reg_username: 'اسم المستخدم (Username)',
    auth_reg_whatsapp: 'رقم الواتساب (للتواصل وتأكيد الشحن)',
    auth_reg_email: 'البريد الإلكتروني',
    auth_reg_pass_hint: 'كلمة المرور (6 أحرف على الأقل)',
    auth_reg_submit: 'إنشاء الحساب الآن',
    auth_registering: 'جاري إنشاء الحساب...',
    auth_have_account: 'لديك حساب بالفعل؟',
    auth_login_link: 'تسجيل الدخول',

    room_back: 'العودة إلى صالة التحديات',
    room_code_header: 'رمز الغرفة في eFootball (Room Code)',
    room_code_copy: 'نسخ الرمز',
    room_code_copied: 'تم النسخ!',
    room_code_save: 'حفظ الرمز',
    room_code_input_prompt: 'أنشئ غرفة في تطبيق eFootball وأدخل الرمز هنا لينضم منافسك:',
    room_code_waiting_host: 'في انتظار قيام منشئ التحدي بإدخال رمز الغرفة...',
    room_host: 'المضيف (صاحب التحدي)',
    room_opponent: 'المنافس',
    room_waiting_opponent: 'في انتظار انضمام منافس...',
    room_prize_label: 'جائزة الفائز',
    room_winner_announcement: 'الفائز في المباراة هو:',
    room_winner_awarded: 'تم تحويل الجائزة مباشرة إلى محفظته بأمان!',
    room_cancel_challenge: 'إلغاء التحدي واسترجاع الرصيد',
    room_dispute_banner_title: 'نزاع قيد المراجعة والتحكيم (Dispute)',
    room_dispute_banner_desc: 'تم رفع النزاع إلى الإدارة للمراجعة وفصل النتيجة استناداً إلى لقطات الشاشة. أموال المباراة مؤمنة بالكامل في نظام Escrow.',
    room_submit_result_title: 'تأكيد نتيجة المباراة',
    room_result_sent_badge: 'تم إرسال نتيجتك ✓',
    room_who_won: 'من الفائز في المباراة؟',
    room_i_won: '🏆 أنا الفائز',
    room_opponent_won: '🤝 المنافس هو الفائز',
    room_my_score: 'أهدافك المسجلة (مثال: 3)',
    room_screenshot: 'لقطة شاشة لنتيجة المباراة من eFootball',
    room_submit_btn: 'إرسال النتيجة وتأكيد الفوز',
    room_result_recorded: '✓ تم تسجيل نتيجتك. بمجرد تأكيد المنافس، سيتم تحويل الجائزة تلقائياً!',
    room_chat_title: 'محادثة المباراة المباشرة',
    room_chat_placeholder: 'اكتب رسالة للمنافس...',
    room_chat_empty: 'لا توجد رسائل بعد. تواصل مع منافسك هنا!',
    room_chat_only_players: 'الدردشة متاحة فقط لطرفي المباراة.'
  },

  darija_ar: {
    site_title: 'إي فوتبول أرينا',
    site_subtitle: '1 ضد 1 وبطولات المغرب',
    nav_matches: 'تحديات 1 ضد 1',
    nav_tournaments: 'البطولات (Tournois)',
    nav_leaderboard: 'الترتيب',
    nav_admin: 'إدارة الموقع',
    nav_login: 'دخول',
    nav_register: 'تسجل فابور',
    nav_recharge: 'شحن الرصيد',
    nav_balance: 'الرصيد',
    nav_logout: 'خروج',
    nav_profile: 'حسابي',

    hero_badge: 'المنصة رقم 1 فالمغرب لإي فوتبول',
    hero_title_1: 'لعب ',
    hero_title_highlight: '1 ضد 1 وبطولات',
    hero_title_2: ' برصيد كاش!',
    hero_desc: 'تحدى أحسن اللعابة فـ eFootball موبايل ولا كونسول. شحن رصيدك بطريقة يدوية ساهلة (CIH أو كاش بلوس) وربح فلوسك بضمانة 100% إسكرو.',
    hero_btn_create: 'صاوب تحدي 1 ضد 1',
    hero_btn_recharge: 'شحن الحساب (كاش)',
    hero_stat_matches: 'ماتش ملعوب',
    hero_stat_prizes: 'جوائز موزعة',
    hero_stat_escrow: 'ضمانة إسكرو 100%',

    live_available: 'ماتشات متوفرة دابا',
    see_all: 'شوف كلشي',
    no_open_matches: 'ما كاين حتى ماتش دابا، كون نتا اللول لي يصاوب تحدي!',
    create_challenge_btn: 'صاوب تحدي جديد',
    stake: 'الميز',
    prize: 'الجائزة',
    accept: 'قبل',

    how_title: 'كيفاش كيخدم الموقع؟',
    how_subtitle: '4 خطوات ساهلة باش تشحن رصيدك وتبدا تلعب 1 ضد 1 وبطولات',
    step1_title: 'شحن الحساب (يدوي)',
    step1_desc: 'ختار شحال بغيتي تشحن (20، 50، 100 درهم...) وصيفط للأدمن فالواتساب (CIH أو كاش بلوس). الأدمن كيزيدك الرصيد فالبلاصة.',
    step2_title: 'صاوب ولا قبل التحدي',
    step2_desc: 'ختار الميز (10 دراهم، 20 درهم...) ونوع الجهاز (موبايل أو كونسول). الرصيد كيتكوانسا فالموقع بأمان (Escrow).',
    step3_title: 'تبادلو كود الروم فـ eFootball',
    step3_desc: 'خود كود الغرفة (Room Code) من الشات، دخل للعبة إي فوتبول ولعبو الماتش العادي 10 دقائق.',
    step4_title: 'صيفط السكرين وخود فلوسك',
    step4_desc: 'صيفط لقطة شاشة للنتيجة. الرابح كياخد الجائزة ديريكت فالمحفظة ديالو ويقدر يسحبها فـ أي وقت.',

    tourn_title: 'البطولات الأسبوعية (Tournaments)',
    tourn_subtitle: 'تسجل فالبطولات وربح جوائز كبار',
    tourn_entry_fee: 'الواجب',
    tourn_players: 'اللعابة',
    tourn_start: 'وقت البداية',
    tourn_details: 'التفاصيل والتسجيل',

    escrow_title: 'نظام إسكرو الضامن 100% (ضمانة الفلوس)',
    escrow_desc: 'الفلوس ديال كل ماتش كيتكوانساو فالسيت قبل ما يبدا الماتش. ما كاينش لي يغدر ولا يهرب. وفحالة أي خلاف، الأدمن كيشوف السكرينات وكيحكم بالعدل.',
    escrow_cta: 'شحن الرصيد دابا',

    footer_subtitle: 'المنصة رقم 1 فالمغرب للبطولات وتحديات 1 ضد 1',
    footer_payment: 'خلاص يدوي: CIH Bank و كاش بلوس',
    footer_escrow: 'ضمانة إسكرو 100%',
    footer_rights: 'جميع الحقوق محفوظة',

    lang_official: 'الرسمية',
    lang_select_title: 'ختار اللغة',
    lang_ar_fusha: 'العربية الفصحى (الرسمية)',
    lang_darija_ar: 'الدارجة المغربية',
    lang_darija_latin: 'الدارجة (Latin)',

    matches_title: 'قاعة تحديات 1 ضد 1',
    matches_subtitle: 'ختار تحدي واجد ولا صاوب واحد جديد وتسنى لعاب يقبلو',
    matches_create_btn: 'صاوب تحدي جديد',
    matches_tab_open: 'متاح (Open)',
    matches_tab_playing: 'ملعوب دابا (Playing)',
    matches_tab_dispute: 'خلاف (Dispute)',
    matches_tab_completed: 'سلاو (Terminé)',
    matches_tab_all: 'كلشي',
    matches_platform_label: 'الجهاز:',
    matches_platform_all: 'كاع الأجهزة',
    matches_loading: 'كانشارجي الماتشات...',
    matches_empty_title: 'ما كاين حتى ماتش فهاد القسم دابا',
    matches_empty_desc: 'كون نتا اللول لي يصاوب تحدي جديد!',
    matches_vs: 'ضد',
    matches_waiting: 'فانتظار لعاب...',
    matches_view: 'شوف الماتش',
    matches_your_match: 'شوف الماتش ديالك',
    matches_join_btn: 'قبل التحدي',
    matches_enter_room: 'دخل لغرفة الماتش',
    matches_insufficient_balance: 'رصيدك ما كافيش لهاد التحدي.',

    modal_create_title: 'صاوب تحدي 1 ضد 1',
    modal_create_subtitle: 'صاوب ماتش وتسنى لعاب آخر يدخل يلعب معاك',
    modal_stake_label: 'الميز / شحال غتلعبو (درهم)',
    modal_platform_label: 'الجهاز (Platform)',
    modal_title_label: 'عنوان التحدي (اختياري)',
    modal_title_placeholder: 'مثال: تحدي للمحترفين 20 درهم',
    modal_prize_calc: 'الجائزة ديال الرابح',
    modal_fee_note: '10% نسبة المنصة للضمان ونظام Escrow',
    modal_submit_btn: 'أكد وصاوب التحدي',
    modal_creating: 'كيصاوب الماتش...',
    modal_recharge_prompt: 'رصيدك ما كافيش، خاصك تشحن الحساب قبل.',

    recharge_title: 'شحن الرصيد (Recharge)',
    recharge_subtitle: 'زيد فلوس فالحساب باش تلعب ماتشات وتدخل للبطولات',
    recharge_tab_new: 'طلب شحن جديد',
    recharge_tab_history: 'تاريخ الطلبات',
    recharge_select_amount: 'ختار شحال تشحن (درهم)',
    recharge_other_amount: 'مبلغ آخر...',
    recharge_method: 'طريقة الخلاص',
    recharge_admin_info: 'معلومات الحساب ديال الأدمن',
    recharge_your_whatsapp: 'نمرتك فالواتساب (باش نتواصلو معاك)',
    recharge_notes: 'ملاحظات (اختياري)',
    recharge_notes_ph: 'مثال: فيرمون بسميتي...',
    recharge_submit: 'صيفط طلب الشحن',
    recharge_sending: 'كانصيفطو الطلب...',
    recharge_success_title: 'تسجل طلب الشحن بنجاح!',
    recharge_request_num: 'رقم الطلب ديالك:',
    recharge_amount: 'المبلغ:',
    recharge_status_pending: 'ف طور المراقبة',
    recharge_status_approved: 'تقبلات ✓',
    recharge_status_rejected: 'مرفوضة ✕',
    recharge_whatsapp_btn: 'تواصل مع الأدمن فالواتساب دابا',
    recharge_whatsapp_note: 'كليكي على البوطونة الخضرا باش يتحل واتساب مع الأدمن نيشان ويتفاليدا ليك الرصيد فالبلاصة.',
    recharge_back: 'رجع للموقع',
    recharge_history_empty: 'مازال ما درتي حتى طلب شحن قبل.',
    recharge_history_loading: 'كانشارجي تاريخ الطلبات...',

    tourn_page_title: 'البطولات الأسبوعية (Tournois)',
    tourn_page_subtitle: 'بطولات كبار برصيد كاش. تيرّاج ديريكت وماتشات 10 دقائق.',
    tourn_admin_manage: 'إدارة البطولات (Admin)',
    tourn_total_prize: 'مجموع الجوائز:',
    tourn_places: 'بلايص',
    tourn_format: 'النظام',
    tourn_knockout: 'إقصاء مباشر',
    tourn_distribution: 'تقسيم الجوائز:',
    tourn_joined_already: 'تسجلتي ديجا فهاد البطولة ✓',
    tourn_register_btn: 'تسجل فالبطولة',
    tourn_registering: 'كانسجلوك...',

    lead_page_title: 'ترتيب الأبطال (Leaderboard)',
    lead_page_subtitle: 'أحسن اللعابة فالمغرب على حساب الرابحات',
    lead_admin_manage: 'إدارة الترتيب (Admin)',
    lead_rank: 'الرتبة',
    lead_player: 'اللعاب',
    lead_efootball_id: 'آيدي eFootball',
    lead_wins: 'الرابحات',
    lead_losses: 'الخاسرات',
    lead_win_rate: 'نسبة الرباح',
    lead_loading: 'كانشارجي الترتيب...',

    prof_admin_super: 'حساب السوبر أدمن (Super Admin)',
    prof_admin_desc: 'كأدمن، عندك التحكم الكامل فطلبات الشحن، السحب، ومشاكل الماتشات.',
    prof_admin_panel: 'دخل للوحة التحكم',
    prof_wallet_title: 'المحفظة ديالي (Wallet)',
    prof_available: 'الرصيد المتوفر دابا',
    prof_recharge: 'شحن الرصيد (+)',
    prof_withdraw: 'سحب الفلوس',
    prof_withdraw_title: 'طلب سحب الفلوس (Retrait)',
    prof_withdraw_amount: 'المبلغ لي باغي تسحب',
    prof_withdraw_method: 'طريقة السحب',
    prof_withdraw_dest: 'معلومات التحويل (RIB أو كاش بلوس مع لاكارط)',
    prof_withdraw_submit: 'صيفط طلب السحب',
    prof_transactions_title: 'سجل المعاملات (Historique)',
    prof_tx_type: 'النوع',
    prof_tx_desc: 'الوصف',
    prof_tx_date: 'التاريخ',
    prof_tx_amount: 'المبلغ',
    prof_tx_balance: 'الرصيد موراها',
    prof_tx_empty: 'مازال ما كاينا حتى حركة فحسابك.',
    prof_need_login: 'خاصك تسجل الدخول باش تشوف البروفيل.',

    auth_login_title: 'دخل لحسابك',
    auth_login_subtitle: 'لعب 1 ضد 1 وشحن رصيدك بأمان',
    auth_username_email: 'الاسم أو الإيميل',
    auth_password: 'المودباس',
    auth_login_submit: 'دخول',
    auth_logging_in: 'كانتكونيكطاو...',
    auth_no_account: 'مازال ما عندك حساب؟',
    auth_register_link: 'تسجل دابا فابور',
    auth_reg_title: 'صاوب حساب جديد',
    auth_reg_subtitle: 'دخل لأكبر مجتمع ديال لعابة إي فوتبول فالمغرب',
    auth_reg_username: 'اسم المستخدم (Username)',
    auth_reg_whatsapp: 'نمرة الواتساب (باش نتواصلو معاك فالشحن)',
    auth_reg_email: 'الإيميل',
    auth_reg_pass_hint: 'المودباس (6 حروف على الأقل)',
    auth_reg_submit: 'تسجل دابا',
    auth_registering: 'كانسجلو الحساب...',
    auth_have_account: 'عندك حساب ديجا؟',
    auth_login_link: 'دخل هنا',

    room_back: 'رجع لقاعة التحديات',
    room_code_header: 'كود الروم فـ eFootball (Room Code)',
    room_code_copy: 'كوبي الكود',
    room_code_copied: 'تكوبات!',
    room_code_save: 'سجل الكود',
    room_code_input_prompt: 'صاوب روم فاللعبة وحط الكود هنا باش يدخل صاحبك:',
    room_code_waiting_host: 'كنتسناو مول الماتش يحط كود الروم...',
    room_host: 'مول الماتش',
    room_opponent: 'الخصم',
    room_waiting_opponent: 'كنتسناو خصم يدخل...',
    room_prize_label: 'جائزة الرابح',
    room_winner_announcement: 'الرابح فالماتش هو:',
    room_winner_awarded: 'الجائزة تصيفطات نيشان للمحفظة ديالو!',
    room_cancel_challenge: 'لغي الماتش ورجع الميز',
    room_dispute_banner_title: 'كاين خلاف (تحكيم الأدمن)',
    room_dispute_banner_desc: 'الأدمن كيشوف السكرينات باش يحكم فالنتيجة. الفلوس مكوانسية فأمان فـ Escrow.',
    room_submit_result_title: 'تأكيد نتيجة الماتش',
    room_result_sent_badge: 'صيفطتي النتيجة ✓',
    room_who_won: 'شكون لي ربح الماتش؟',
    room_i_won: '🏆 أنا لي ربحت',
    room_opponent_won: '🤝 الخصم لي ربح',
    room_my_score: 'الأهداف لي ماركيتيش',
    room_screenshot: 'سكرين شوت للنتيجة من اللعبة',
    room_submit_btn: 'أكد النتيجة',
    room_result_recorded: '✓ تسجلات النتيجة ديالك. غير يأكد الخصم كتدوز الفلوس فالبلاصة!',
    room_chat_title: 'شات الماتش',
    room_chat_placeholder: 'كتب ميساج للخصم...',
    room_chat_empty: 'ما كاين حتى ميساج دابا. هضر مع الخصم هنا!',
    room_chat_only_players: 'الشات متاح غير للعابة لي كاينين فالماتش.'
  },

  darija_latin: {
    site_title: 'eFootball ARENA',
    site_subtitle: '1vs1 & Botolat Morocco',
    nav_matches: '1vs1 Challenges',
    nav_tournaments: 'Botolat (Tournois)',
    nav_leaderboard: 'Classement',
    nav_admin: 'Idarat L-Mawqi3',
    nav_login: 'Dkhol',
    nav_register: 'Tsjel Fabor',
    nav_recharge: 'Chahn (+ Recharge)',
    nav_balance: 'Rasid',
    nav_logout: 'Khoroj',
    nav_profile: 'Mon Profil',

    hero_badge: 'Manssat eFootball Raqm 1 f L-Mghrib',
    hero_title_1: 'L3eb ',
    hero_title_highlight: '1vs1 & Botolat',
    hero_title_2: ' b Rasid Kaaach!',
    hero_desc: 'Tahadda ahsan la3ibin f eFootball Mobile awla Console. Chhan rasid dyalk b tariqa yadawiya sahla (CIH / Cash Plus) w rbeh flousek b damana 100% Escrow.',
    hero_btn_create: 'Kreye Challenge 1vs1',
    hero_btn_recharge: 'Chahn l-Hisab (Recharge)',
    hero_stat_matches: 'Match Ml3oub',
    hero_stat_prizes: 'Jawa\'iz Mwez3a',
    hero_stat_escrow: 'Escrow Garanti',

    live_available: 'Match Direct Disponible',
    see_all: 'Chouf Kolchi',
    no_open_matches: 'Makaynx match open daba. Kon nta lewel li ycreyi challenge!',
    create_challenge_btn: 'Kreye Challenge Jdid',
    stake: 'Mise',
    prize: 'Ja\'iza',
    accept: 'Qbel',

    how_title: 'Kifash Kaykhdem L-Mawqi3?',
    how_subtitle: '4 khatawat sahla bach t-chhan rasid dyalk w t-bda tl3eb 1vs1 w botolat',
    step1_title: 'Chhan L-Hisab (Yadawi)',
    step1_desc: 'Khtar l-mablagh (20, 50, 100 DH...) w sift virement l l-admin f WhatsApp (CIH aw Cash Plus). Admin kayzid lik rasid f l-blast.',
    step2_title: 'Kreye awla Qbel Challenge',
    step2_desc: 'Khtar l-mise (10 DH, 20 DH...) w khtar l-platform (Mobile awla Console). Rasid kaytbloka f l-mawqi3 (Escrow aman).',
    step3_title: 'Tbadlo Room Code f eFootball',
    step3_desc: 'Khoud Room Code mn l-chat dyal l-match, dkhol f eFootball app w l3bo l-match standard 10 min.',
    step4_title: 'Sift Capture & Khoud Flousek',
    step4_desc: 'Sift screenshot dyal natija. L-fayez kayakhod l-jaiza direct f l-mahfada dyalo w y9der yss-habha f ay weqt.',

    tourn_title: 'Botolat L-Usboo3iya (Tournaments)',
    tourn_subtitle: 'Tsjel f l-botolat w rbeh ja\'iza kbira',
    tourn_entry_fee: 'Frais',
    tourn_players: 'La3ibin',
    tourn_start: 'Weqt l-bdaya',
    tourn_details: 'Tafasil & Tasjil',

    escrow_title: 'Nidam Escrow Damin 100% (Damanat l-Flous)',
    escrow_desc: 'Flous kola match kaytblokaw f l-system qbel ma ybda l-match. Makaynx li y-ghrek awla yhrab. F halat ay khilaf, l-Admin kaychouf les captures w kay-tranchi b l-3adl.',
    escrow_cta: 'Chhan Rasid Daba',

    footer_subtitle: 'Manssa maghribiya li l-tournois w l3ib 1vs1',
    footer_payment: 'Paiement Yadawi: CIH Bank & Cash Plus',
    footer_escrow: 'Escrow Aman 100%',
    footer_rights: 'Tous droits réservés',

    lang_official: 'Officielle',
    lang_select_title: 'Khtar l-Lougha',
    lang_ar_fusha: 'L-3arabiya L-Fousha (Officielle)',
    lang_darija_ar: 'Darija b l-3arbiya',
    lang_darija_latin: 'Darija (Latin)',

    matches_title: 'Lobby 1vs1 Challenges',
    matches_subtitle: 'Khtar challenge awla kreye wahed jdid w tsenna la3ib y-accepté',
    matches_create_btn: 'Kreye Challenge Jdid',
    matches_tab_open: 'Disponible (Open)',
    matches_tab_playing: 'En cours (Playing)',
    matches_tab_dispute: 'Khilaf (Dispute)',
    matches_tab_completed: 'Salaw (Terminé)',
    matches_tab_all: 'Kolchi',
    matches_platform_label: 'Platform:',
    matches_platform_all: 'Koulchi (All)',
    matches_loading: 'Kan-charjiw les matches...',
    matches_empty_title: 'Makayn hta chi match f had l-halat',
    matches_empty_desc: 'Koun nta lewel li y-creyé match daba!',
    matches_vs: 'VS',
    matches_waiting: 'Kaytsenna la3ib...',
    matches_view: 'Chouf Match',
    matches_your_match: 'Chouf Match Dyalk',
    matches_join_btn: 'Qbel L-Challenge',
    matches_enter_room: 'Dkhol l Room dyal Match',
    matches_insufficient_balance: 'Rasid dyalk ma kafich l had l-match.',

    modal_create_title: 'Incha\'e Challenge 1vs1',
    modal_create_subtitle: 'Kreye match w tsenna la3ib akhor y-accepté',
    modal_stake_label: 'Mablagh l-Mise (DH)',
    modal_platform_label: 'Platform',
    modal_title_label: '3onwan l-Match (Ikhtiyari)',
    modal_title_placeholder: 'Mithal: Challenge Pro 20 DH',
    modal_prize_calc: 'Ja\'iza dyal l-Fayez',
    modal_fee_note: '10% frais dyal manssa l damanat Escrow',
    modal_submit_btn: 'Akid w Kreye Challenge',
    modal_creating: 'Kay-creye...',
    modal_recharge_prompt: 'Rasid dyalk ma kafich. Khassk tchhan l-hisab qbel.',

    recharge_title: 'Chahn l-Hisab (Recharge)',
    recharge_subtitle: 'Zid l-rasid bach tl3eb 1vs1 w les tournois',
    recharge_tab_new: 'Talab Chahn Jdid',
    recharge_tab_history: 'Historique dyal Talabat',
    recharge_select_amount: 'Khtar L-Mablagh (DH)',
    recharge_other_amount: 'Mablagh akhor...',
    recharge_method: 'Tariqat Dfa3',
    recharge_admin_info: 'Ma3loumat l-khalas dyal Admin',
    recharge_your_whatsapp: 'Raqm WhatsApp Dyalk',
    recharge_notes: 'Molahada (Optionnel)',
    recharge_notes_ph: 'Masalan: Virement f smiti...',
    recharge_submit: 'Irsal Talab Chahn',
    recharge_sending: 'Kan-siftou l-talab...',
    recharge_success_title: 'Talab Chahn Tsjel b Naja7!',
    recharge_request_num: 'Raqm l-talab dyalk:',
    recharge_amount: 'L-Mablagh:',
    recharge_status_pending: 'F tor l-moraqaba',
    recharge_status_approved: 'T-validat ✓',
    recharge_status_rejected: 'Trfed ✕',
    recharge_whatsapp_btn: 'Twasel m3a l-Admin f WhatsApp Daba',
    recharge_whatsapp_note: 'Click 3la l-bouton l-khdra bach y-t7ell lik WhatsApp direct m3a l-Admin.',
    recharge_back: 'Rjo3 l l-mawqi3',
    recharge_history_empty: 'Mazal ma derti hta chi talab chahn qbel.',
    recharge_history_loading: 'Kan-charjiw l-historique...',

    tourn_page_title: 'Botolat eFootball (Tournois)',
    tourn_page_subtitle: 'Championships rasmiya b jawai\'z kach mhmma. Tirage au sort direct.',
    tourn_admin_manage: 'Idarat L-Botolat (Admin)',
    tourn_total_prize: 'Ja\'iza Totale:',
    tourn_places: 'Places',
    tourn_format: 'Nidam',
    tourn_knockout: 'Direct Knockout',
    tourn_distribution: 'Ta9sim L-Jawa\'iz:',
    tourn_joined_already: 'Tsjelti deja f had l-botola ✓',
    tourn_register_btn: 'Tasjil f L-Botola',
    tourn_registering: 'Kan-sejlouk...',

    lead_page_title: 'Classement L-Abtal (Leaderboard)',
    lead_page_subtitle: 'Ahsan la3ibin f eFootball f l-Mghrib',
    lead_admin_manage: 'Idarat L-Classement (Admin)',
    lead_rank: 'Rang',
    lead_player: 'Joueur',
    lead_efootball_id: 'eFootball ID',
    lead_wins: 'Victoires',
    lead_losses: 'Défaites',
    lead_win_rate: 'Win Rate',
    lead_loading: 'Kan-charjiw l-classement...',

    prof_admin_super: 'Compte Super Admin',
    prof_admin_desc: 'K-Admin, nta li kat-tahkkam f talabat l-chahn, tahwilat w hal l-khilafat.',
    prof_admin_panel: 'Dkhol l Lawhat Tahakkum',
    prof_wallet_title: 'Mahfadat L-Flous (Wallet)',
    prof_available: 'Rasid l-Mota7',
    prof_recharge: 'Chahn (+ Recharge)',
    prof_withdraw: 'Sahb (Retrait)',
    prof_withdraw_title: 'Talab Sahb L-Flous (Retrait)',
    prof_withdraw_amount: 'Mablagh l-sahb',
    prof_withdraw_method: 'Tariqat L-Sahb',
    prof_withdraw_dest: 'Ma3loumat l-sahb (RIB / Nom / CIN)',
    prof_withdraw_submit: 'Irsal Talab Sahb',
    prof_transactions_title: 'Sijil L-Mu3amalat (Historique)',
    prof_tx_type: 'Type',
    prof_tx_desc: 'Description',
    prof_tx_date: 'Date',
    prof_tx_amount: 'Mablagh',
    prof_tx_balance: 'Solde apres',
    prof_tx_empty: 'Mazal makayn hta chi transaction f hisabek.',
    prof_need_login: 'Khassek t-connecta bach tchouf l-profil dyalk.',

    auth_login_title: 'Dkhol l Hisab Dyalk',
    auth_login_subtitle: 'L3eb 1vs1 w chhan rasid dyalk f kol wa9t',
    auth_username_email: 'Username awla Email',
    auth_password: 'Mot de passe',
    auth_login_submit: 'Dkhol',
    auth_logging_in: 'Kan-tconnectaw...',
    auth_no_account: 'Mazal ma 3ndekch hisab?',
    auth_register_link: 'Tsjel daba fabor',
    auth_reg_title: 'Fte7 Hisab Jdid',
    auth_reg_subtitle: 'Dkhol l-komyuniti dyal l3iba dyal eFootball f l-Mghrib',
    auth_reg_username: 'Pseudo / Username',
    auth_reg_whatsapp: 'Raqm WhatsApp (Bach Admin ytwasel m3ak)',
    auth_reg_email: 'Email',
    auth_reg_pass_hint: 'Mot de passe (Min 6 caractères)',
    auth_reg_submit: 'Tsjel Daba',
    auth_registering: 'Kan-sejlou l-compte...',
    auth_have_account: '3ndek hisab deja?',
    auth_login_link: 'Dkhol l hisabk',

    room_back: 'Rjo3 l l-Lobby',
    room_code_header: 'Room Code dyal eFootball',
    room_code_copy: 'Copier Code',
    room_code_copied: 'Copied!',
    room_code_save: 'Sauvegarder',
    room_code_input_prompt: 'Kreye ghorfa f eFootball app w dakhel l-code hna:',
    room_code_waiting_host: 'Mazal mol l-match ma dkhlch l-code...',
    room_host: 'Hôte (Moul l-match)',
    room_opponent: 'Adversaire',
    room_waiting_opponent: 'En attente dun joueur...',
    room_prize_label: 'Ja\'izat l-Fayez',
    room_winner_announcement: 'L-Fayez Houwa:',
    room_winner_awarded: 'L-ja\'iza t-versat direct f l-mahfada dyalo!',
    room_cancel_challenge: 'Annuler L-Match w Rje3 l-mise',
    room_dispute_banner_title: 'Khilaf mwejahe l l-Admin (Dispute Active)',
    room_dispute_banner_desc: 'L-Admin kay-checké daba les preuves w ghay-tranchi f a9rab weqt. Flous l-match m7miya f l-Escrow.',
    room_submit_result_title: 'Tasjil Natijat L-Match (Confirmation)',
    room_result_sent_badge: 'Sifti natija ✓',
    room_who_won: 'Chkoun li rbeh l-match?',
    room_i_won: '🏆 Ana li rbeht (Moi)',
    room_opponent_won: '🤝 La3ib lakhor li rbeh',
    room_my_score: 'Score dyalk (Ex: 3)',
    room_screenshot: 'Capture d\'écran (Screenshot Natija)',
    room_submit_btn: 'Sift Natija & Valider',
    room_result_recorded: '✓ Natija dyalk tsjlat. Ghir y-sift la3ib lakhor natija dyalo, l-system ghay-validi!',
    room_chat_title: 'Chat dyal l-Match',
    room_chat_placeholder: 'Kteb message...',
    room_chat_empty: 'Mazal makayn hta message. Bda l-hadra m3a l-khssim!',
    room_chat_only_players: 'Ghir la3ibin f had l-match li 3ndhom l-haq y-khedmo l-chat.'
  }
};
