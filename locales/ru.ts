console.log('Loaded RU');

export default {
  logIn: "Войти",
  register: "Зарегистрироваться",
  password: "Пароль",
  confirmPassword: "Подтвердите пароль",
  bookLessonFirst: 'Записаться',
  bookLessonSecond: 'на занятие',
  submit: "Подтвердить",
  date: "Дата",
  time: "Время",
  yes: "Да",
  no: "Нет",
  studentName: "Имя ученика",
  telNumber: "Телефон",
  update: "Обновить",
  deleteAccount: "Удалить аккаунт",
  cancelChanges: "Отменить",
  fullName: "Полное Имя",
  lessonDuration: "Длительность Занятия",
  lessonPrice: "Цена Занятия",
  '30 min': "30 мин",
  '1 hour': "1 час",
  '2 hours': "2 часа",
  'Monday': "Понедельник",
  'Tuesday': "Вторник",
  'Wednesday': "Среда",
  'Thursday': "Четверг",
  'Friday': "Пятница",
  'Saturday': "Суббота",
  'Sunday': "Воскресенье",
  'online': "Онлайн",
  'on-site': "На месте",
  'both': "Оба",
  appointments: "Занятия",
  settings: "Настройки",

  // warnings and messages
  timeShouldFormat: 'Время должно быть в формате "14:30"',
  theTimeActive: "Это время уже активно",
  passwordNotValid: "Неверный пароль",
  enterPassword: "Введите пароль",
  enterEmail: "Введите email",
  emailNotValid: "Неверный email",
  acceptPrivacyPolicy: "Примите Политику конфиденциальности, чтобы продолжить",
  emailInUse: "Этот email уже используется",
  passwordWeak: "Ваш пароль ненадежен",
  smthWentWrong: "Что-то пошло не так, попробуйте ещё раз",
  passwordsDontMatch: "Пароли не совпадают",

  'scope.book.bookLessonTitle': 'Записаться на занятие с {teacherName}',
  'scope.book.studentAge': "Возраст ученика",
  'scope.book.chooseDateOfLesson': "Выберите дату занятия",
  'scope.book.chooseTimeOfLesson': "Выберите время занятия",
  'scope.book.payOnline': "Оплатить онлайн",
  'scope.book.onlyOnSite': "{teacherName} принимает только оплату на месте",
  'scope.book.onlyOnline': "{teacherName} принимает только онлайн-оплату",
  'scope.book.slots': " свободных",

  'scope.appointments.lessonStatus': "Статус занятия",
  'scope.appointments.dateOrder': "Порядок дат",
  'scope.appointments.Upcoming': "Предстоящие",
  'scope.appointments.Held': "Прошедшие",
  'scope.appointments.All': "Все",
  'scope.appointments.Most recent': "Самые ранние",
  'scope.appointments.Least recent': "Самые поздние",
  'scope.appointments.age': "Возраст",
  'scope.appointments.paid': "Оплачено",
  'scope.appointments.price': "Цена",
  'scope.appointments.noResults': "Нет результатов поиска",

  'scope.settings.Account': "Аккаунт",
  'scope.settings.Lessons': "Занятия",
  'scope.settings.lessonSettings': "Настройки занятий",
  'scope.settings.addNewTime': "Добавить время",
  'scope.settings.addLessonTimes': "Добавить время занятий",
  'scope.settings.paymentMethods': "Способы оплаты",
  'scope.settings.paymentMethod': "Способ оплаты",
  'scope.settings.connectPayments': "Подключить онлайн-оплату",
  'scope.settings.cardConnected': "Карта подключена",
  'scope.settings.submitBeforeConnecting': "Пожалуйста, сохраните или отмените все изменения, сделанные в вашем профиле, перед продолжением онлайн-оплаты.",
  'scope.settings.daysOfLessons': "Дни занятий",
  'scope.settings.lessonTimes': "Время занятий",
  'scope.settings.language': "Язык",
  'scope.settings.deleteAccConfirm': "Вы уверены, что хотите удалить свой аккаунт?",
  'scope.settings.teacherLink': "Ссылка на вашу форму бронирования",
  'scope.settings.copyLink': "Скопировать ссылку",
  'scope.settings.linkCopied': "Ссылка скопирована",
  'scope.settings.clickToRemove': 'Нажмиты чтобы удалить',

  'scope.auth.forename': "Имя",
  'scope.auth.lastName': "Фамилия",
  'scope.auth.registerWith': "Войти через {provider}",
  'scope.auth.loginWith': "Войти через {provider}",
  'scope.auth.registerHere': "Зарегистрируйтесь здесь",
  'scope.auth.loginHere': "Войдите здесь",
  'scope.auth.alreadyHaveAcc': "Уже зарегистрированы?",
  'scope.auth.dontHaveAcc': "Еще не зарегестрированы?",
  'scope.auth.currentPassword': "Текущий пароль",
  'scope.auth.newPassword': "Новый пароль",
  'scope.auth.privacyPolicy1': "Я прочитал(а) и согласен(на) с ",
  'scope.auth.privacyPolicy2': "Политикой конфиденциальности",
  'scope.auth.signInAsTeacher': "Хотите зарегистрироваться в качестве учителя?",

  'scope.email.lessonBooking': "Бронирование занятия",
  'scope.email.teacherBookingHtml': '<p>{studentName} забронировал(а) занятие с вами {lessonDate} в {lessonTime}.</p>\n<p>С наилучшими пожеланиями</p>',
  'scope.email.userBookingConfirmationHtml': '<p>Ваше бронирование подтверждено, спасибо за бронирование занятия с {teacherName} {lessonDate} в {lessonTime}.</p>\n  <p>Если у вас есть какие-либо вопросы или вы хотите перенести занятие, дайте нам знать как можно раньше.</p>\n  <p>С наилучшими пожеланиями</p>',
} as const;