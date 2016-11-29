/*
* requirejs config
* */
requirejs.config({
    'baseUrl': '/src/js',
    'urlArgs': 'v=0.0.1',
    'waitSeconds': 60,
    'paths': {
        'jQuery':'jquery-3.1.0.js',
        'jTool':'jTool',
        'GridManager': 'GridManager',
        'checkboxGM': 'GridManager.checkbox',
        'adjustGM': 'GridManager.adjust',
        'ajaxPageGM': 'GridManager.ajaxPage',
        'baseGM': 'GridManager.base',
        'configGM': 'GridManager.config',
        'dragGM': 'GridManager.drag',
        'exportGM': 'GridManager.export',
        'i18nGM': 'GridManager.i18n',
        'menuGM': 'GridManager.menu',
        'orderGM': 'GridManager.order',
        'remindGM': 'GridManager.remind',
        'sortGM': 'GridManager.sort',
        'topGM': 'GridManager.top'
    }
});

