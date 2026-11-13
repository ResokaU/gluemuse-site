# GlueMuse website

Небольшой статический сайт проекта. Discord, Telegram и поддержка находятся в config.js.

GitHub Pages публикует ветку main из корня репозитория. Node.js и сборка на сервере не нужны; шрифты и изображения находятся в assets.

До первого стабильного релиза 1.0 скачивание отключено. Скрипт проверяет GitHub Releases, исключает draft, prerelease и версии 0.x. После публикации стабильного тега v1.0.0 с Windows .exe кнопка укажет на этот файл. Альфа-сборки не публикуются на сайте.

Демо плеера не воспроизводит звук. Иллюстрация «окно напротив» создана специально для сайта с ImageGen. Избранное и оформление макета работают локально в пределах страницы.

Источники для исследования взаимодействий:
- React Bits Tilted Card: https://reactbits.dev/components/tilted-card
- React Bits Spotlight Card: https://reactbits.dev/components/spotlight-card

Наклон и подсветка реализованы в site.js для статического сайта; код React Bits не включён. Иконки в блоках возможностей — Lucide, шрифт — Onest (лицензия в assets/FONT-LICENSE.txt).
