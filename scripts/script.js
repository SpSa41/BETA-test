POI = {
    'Главный вход ВДНХ': [55.826296, 37.637650],
    'Музей ВДНХ': [55.826685, 37.638764],
    'Павильон №1': [55.828693, 37.633724],
    'Павильон №2': [55.828465, 37.631433],
    'Музей Космноавтики': [55.822751, 37.639752],
    'Москвариум': [55.832931, 37.618807],
    'Исторический парк Россия-Моя история': [55.834168, 37.626331],
    'Рабочий и колхозница': [55.828263, 37.646256],
    'Музей Оптических Иллюзий': [55.835422, 37.623205],
    'Робостанция ': [55.828465, 37.631433],
    'Фонтан Каменный цветок': [55.832172, 37.628010],
    'Павильон Армения': [55.830872, 37.633733],
    'Sky Town': [55.835124, 37.614463],
    'Павильон №34 Космонавтика и авиация': [55.835265, 37.621507],
    'Павильон №67 Карелия': [55.831049, 37.632592],

}


// btnGoTo = document.querySelector('.goTo');
// btnGoTo.onclick = newPoint;

// function newPoint() {
//     var multiRoute = new ymaps.multiRouter.MultiRoute({
//         referencePoints: ,
//     });
// }

function init() {
    /**
     * Создание мультимаршрута.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
     */
    var multiRoute = new ymaps.multiRouter.MultiRoute({
        
        referencePoints: [POI['Главный вход ВДНХ']],
        
        params: {
            routingMode: 'pedestrian'
        }
    }, {
        // Тип промежуточных точек, которые могут быть добавлены при редактировании.
        editorMidPointsType: "via",
        // В режиме добавления новых путевых точек разрешаем ставить точки поверх объектов карты.
        editorDrawOver: true,

        // Внешний вид линии маршрута
        routeActiveStrokeWidth: 5,
        routeActiveStrokeStyle: 'solid',
        routeActiveStrokeColor: "#FF3134",
    });

    var buttonEditor = new ymaps.control.Button({
        data: {
            content: "Редактировать"
        }
    });

    buttonEditor.events.add("select", function () {
        /**
         * Включение режима редактирования.
         * В качестве опций может быть передан объект с полями:
         * addWayPoints - разрешает добавление новых путевых точек при клике на карту. Значение по умолчанию: false.
         * dragWayPoints - разрешает перетаскивание уже существующих путевых точек. Значение по умолчанию: true.
         * removeWayPoints - разрешает удаление путевых точек при двойном клике по ним. Значение по умолчанию: false.
         * dragViaPoints - разрешает перетаскивание уже существующих транзитных точек. Значение по умолчанию: true.
         * removeViaPoints - разрешает удаление транзитных точек при двойном клике по ним. Значение по умолчанию: true.
         * addMidPoints - разрешает добавление промежуточных транзитных или путевых точек посредством перетаскивания маркера, появляющегося при наведении курсора мыши на активный маршрут. Тип добавляемых точек задается опцией midPointsType. Значение по умолчанию: true
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml#editor
         */
        multiRoute.editor.start({
            addWayPoints: true,
            removeWayPoints: true
        });
    });

    buttonEditor.events.add("deselect", function () {
        // Выключение режима редактирования.
        multiRoute.editor.stop();
    });

    // Создаем карту с добавленной на нее кнопкой.
    var myMap = new ymaps.Map('map', {
        center: [55.82695276675343, 37.63646596038814],
        zoom: 16,
        controls: [buttonEditor]
    }, {
        buttonMaxWidth: 300
    });


    // Подписка на событие обновления данных маршрута.
    multiRoute.model.events.add('requestsuccess', function () {
        // Получение ссылки на активный маршрут.
        // В примере используется автомобильный маршрут,
        // поэтому метод getActiveRoute() вернет объект multiRouter.driving.Route.
        var activeRoute = multiRoute.getActiveRoute();
        // Вывод информации о маршруте.
        console.log("Длина: " + activeRoute.properties.get("distance").text);
        console.log("Время прохождения: " + activeRoute.properties.get("duration").text);
        // Для автомобильных маршрутов можно вывести 
        // информацию о перекрытых участках.
        if (activeRoute.properties.get("blocked")) {
            console.log("На маршруте имеются участки с перекрытыми дорогами.");
        }
    });

    // Добавляем мультимаршрут на карту.
    myMap.geoObjects
        .add(multiRoute)

    for (const [key] of Object.entries(POI)) {
        myMap.geoObjects.add(new ymaps.Placemark(POI[key], {
            balloonContent: `Здесь находится <strong>${key}</strong>
            <br>
            <br>
            <button> Зайти </button>`,

        }, {
            preset: 'islands#icon',
            iconColor: '#ff0532'
        }))
    };
}
ymaps.ready(init);