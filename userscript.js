// ==UserScript==
// @name         GeoFS-Flight-records-addon
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  GeoFS 航线记录（导出/导入 JSON）
// @author       Bilibili-我是小猪05 Xiaohongshu-起飞吧！凤凰牌飞机！ GitHub-zssszscnplane
// @match        https://www.geo-fs.com/geofs.php*
// @match        https://*.geo-fs.com/geofs.php*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    var currentLanguage = '简体中文';

    var languageMap = {
        '简体中文': {
            '请输入文字': '请输入文字',
            '查看作者': '查看作者',
            'GeoFS 航线记录': 'GeoFS 航班记录',
            '由 Bilibili-我是小猪05 Xiaohongshu-起飞吧！凤凰牌飞机！ Github-zssszscnplane 制作': '由 Bilibili-我是小猪05 Xiaohongshu-起飞吧！凤凰牌飞机！ Github-zssszscnplane 制作',
            '|    状态    |    完成时间    |    是否完成    |    花费时间    |': '|    状态    |    完成时间    |    是否完成    |    花费时间    |',
            '例子：| 上机 | 1600 | √ | 60 |': '例子：| 上机 | 1600 | √ | 60 |',
            '例子：| 起飞前滑行 | 1610 | √ | 10 |': '例子：| 起飞前滑行 | 1610 | √ | 10 |',
            '例子：| 起飞 | 1615 | √ | -- |': '例子：| 起飞 | 1615 | √ | -- |',
            '例子：| 巡航 | 1715 | √ | 35 |': '例子：| 巡航 | 1715 | √ | 35 |',
            '例子：| 降落 | 1718 | √ | -- |': '例子：| 降落 | 1718 | √ | -- |',
            '例子：| 降落后滑行 | 1728 | √ | 10 |': '例子：| 降落后滑行 | 1728 | √ | 10 |',
            '例子：| 停机 | 1729 | √ | -- |': '例子：| 停机 | 1729 | √ | -- |',
            '例子：| 下机 | 1800 | √ | 31 |': '例子：| 下机 | 1800 | √ | 31 |',
            '目的地(ICTO)': '目的地(ICTO)',
            '始发地(ICTO)': '始发地(ICTO)',
            '航班号': '航班号',
            '导出航班记录' : '导出航班记录',
            '导入航班记录' : '导入航班记录',
            '导入成功': '导入成功',
            '导入失败: 非法 JSON 或 结构不匹配': '导入失败: 非法 JSON 或 结构不匹配',
            'Exported: ': '已导出: ',
            '航线记录': '航线记录'
        },

        'English': {
            '请输入文字': 'Enter text',
            '查看作者': 'View author',
            'GeoFS 航线记录': 'GeoFS Flight Records',
            '由 Bilibili-我是小猪05 Xiaohongshu-起飞吧！凤凰牌飞机！ Github-zssszscnplane 制作': 'Create by Bilibili-我是小猪05 Xiaohongshu-起飞吧！凤凰牌飞机！ Github-zssszscnplane',
            '|    状态    |    完成时间    |    是否完成    |    花费时间    |': '|    Status    |    Time    |    Done    |    Duration    |',
            '例子：| 上机 | 1600 | √ | 60 |': 'Example: | Boarding | 1600 | √ | 60 |',
            '例子：| 起飞前滑行 | 1610 | √ | 10 |': 'Example: | Taxi before takeoff | 1610 | √ | 10 |',
            '例子：| 起飞 | 1615 | √ | -- |': 'Example: | Takeoff | 1615 | √ | -- |',
            '例子：| 巡航 | 1715 | √ | 35 |': 'Example: | Cruise | 1715 | √ | 35 |',
            '例子：| 降落 | 1718 | √ | -- |': 'Example: | Landing | 1718 | √ | -- |',
            '例子：| 降落后滑行 | 1728 | √ | 10 |': 'Example: | Taxi after landing | 1728 | √ | 10 |',
            '例子：| 停机 | 1729 | √ | -- |': 'Example: | Parking | 1729 | √ | -- |',
            '例子：| 下机 | 1800 | √ | 31 |': 'Example: | Deplane | 1800 | √ | 31 |',
            '目的地(ICTO)': 'Destination (ICTO)',
            '始发地(ICTO)': 'Origin (ICTO)',
            '航班号': 'Flight number',
            '导出航班记录' : 'Export Flight Records',
            '导入航班记录' : 'Import Flight Records',
            '导入成功': 'Import success',
            '导入失败: 非法 JSON 或 结构不匹配': 'Import failed: invalid JSON or structure',
            'Exported: ': 'Exported: ',
            '航线记录': 'Flight Records'
        },
    };

    // 创建UI元素
    var soundButton = document.createElement('div');
    soundButton.id = 'flight-records-button';
    // 初始主按钮文字：设置为 "航线记录"
    soundButton.textContent = '航线记录';
    soundButton.style.position = 'fixed';
    soundButton.style.bottom = '130px';
    soundButton.style.right = '30px';
    soundButton.style.backgroundColor = 'white';
    soundButton.style.color = 'black';
    soundButton.style.padding = '10px 20px';
    soundButton.style.borderRadius = '5px';
    soundButton.style.cursor = 'pointer';
    soundButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    soundButton.style.zIndex = '9999';
    document.body.appendChild(soundButton);

    var recordsMenu = document.createElement('div');
    recordsMenu.id = 'records-menu';
    recordsMenu.style.position = 'fixed';
    recordsMenu.style.bottom = '200px';
    recordsMenu.style.right = '30px';
    recordsMenu.style.width = '320px';
    recordsMenu.style.backgroundColor = 'white';
    recordsMenu.style.color = 'black';
    recordsMenu.style.padding = '20px';
    recordsMenu.style.borderRadius = '5px';
    recordsMenu.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    recordsMenu.style.display = 'none';
    recordsMenu.style.maxHeight = '420px';
    recordsMenu.style.overflowY = 'auto';
    recordsMenu.style.zIndex = '9999';
    document.body.appendChild(recordsMenu);

    var menuTitle = document.createElement('h1');
    menuTitle.textContent = languageMap[currentLanguage]['GeoFS 航线记录'];
    menuTitle.style.fontSize = '18px';
    menuTitle.style.marginBottom = '10px';
    recordsMenu.appendChild(menuTitle);

    var menuSubtitle = document.createElement('h2');
    menuSubtitle.textContent = languageMap[currentLanguage]['由 Bilibili-我是小猪05 Xiaohongshu-起飞吧！凤凰牌飞机！ Github-zssszscnplane 制作'];
    menuSubtitle.style.fontSize = '13px';
    menuSubtitle.style.marginBottom = '10px';
    menuSubtitle.style.color = '#666';
    recordsMenu.appendChild(menuSubtitle);

    // ---------- 语言选择器：放在 Create by（menuSubtitle）下面，Idonnmenu 上面，且最左侧 ----------
    var langSelectorContainer = document.createElement('div');
    langSelectorContainer.style.display = 'flex';
    langSelectorContainer.style.justifyContent = 'flex-start'; // 左对齐（最左侧）
    langSelectorContainer.style.width = '100%';
    langSelectorContainer.style.marginBottom = '10px';
    recordsMenu.appendChild(langSelectorContainer);

    var langButton = document.createElement('button');
    langButton.id = 'language-button';
    langButton.textContent = 'Language (语言)';
    langButton.style.fontSize = '12px';
    langButton.style.padding = '4px 8px';
    langButton.style.cursor = 'pointer';
    langButton.style.marginRight = '8px';
    langSelectorContainer.appendChild(langButton);

    var langOptions = document.createElement('div');
    langOptions.id = 'lang-options';
    langOptions.style.display = 'none';
    langOptions.style.marginTop = '6px';
    langOptions.style.textAlign = 'left'; // 左对齐选项
    langOptions.style.gap = '6px';
    // put langOptions directly under the button inside the same container for left alignment
    langSelectorContainer.appendChild(langOptions);

    var zhBtn = document.createElement('button');
    zhBtn.textContent = '简体中文';
    zhBtn.style.padding = '4px 8px';
    zhBtn.style.fontSize = '12px';
    zhBtn.style.cursor = 'pointer';
    zhBtn.style.marginRight = '6px';
    langOptions.appendChild(zhBtn);

    var enBtn = document.createElement('button');
    enBtn.textContent = 'English';
    enBtn.style.padding = '4px 8px';
    enBtn.style.fontSize = '12px';
    enBtn.style.cursor = 'pointer';
    langOptions.appendChild(enBtn);

    // Toggle language options display
    langButton.addEventListener('click', function(e) {
        e.stopPropagation();
        langOptions.style.display = (langOptions.style.display === 'none' || langOptions.style.display === '') ? 'block' : 'none';
    });
    // hide lang options when clicking outside menu
    document.addEventListener('click', function() {
        if (langOptions) langOptions.style.display = 'none';
    });
    langOptions.addEventListener('click', function(e) {
        e.stopPropagation(); // prevent outer click handler from immediately hiding
    });
    // ------------------------------------------------------------------------------

    var Idonnmenu = document.createElement('h3');
    Idonnmenu.textContent = '-------------' + languageMap[currentLanguage]['GeoFS 航线记录'] + '----------------';
    Idonnmenu.style.fontSize = '13px';
    Idonnmenu.style.marginBottom = '10px';
    Idonnmenu.style.color = '#000'; // 改为黑色
    recordsMenu.appendChild(Idonnmenu);

    var fromInput = document.createElement('input');
    fromInput.type = 'text';
    fromInput.id = 'from-Input';
    fromInput.placeholder = languageMap[currentLanguage]['始发地(ICTO)'];
    fromInput.style.width = '100%';
    fromInput.style.marginBottom = '6px';
    recordsMenu.appendChild(fromInput);

    var destinationInput = document.createElement('input');
    destinationInput.type = 'text';
    destinationInput.id = 'destination-Input';
    destinationInput.placeholder = languageMap[currentLanguage]['目的地(ICTO)'];
    destinationInput.style.width = '100%';
    destinationInput.style.marginBottom = '6px';
    recordsMenu.appendChild(destinationInput);

    var flightnumberInput = document.createElement('input');
    flightnumberInput.type = 'text';
    flightnumberInput.id = 'flight-number-Input';
    flightnumberInput.placeholder = languageMap[currentLanguage]['航班号'];
    flightnumberInput.style.width = '100%';
    flightnumberInput.style.marginBottom = '6px';
    recordsMenu.appendChild(flightnumberInput);

    var egmenu = document.createElement('h5');
    egmenu.textContent = languageMap[currentLanguage]['|    状态    |    完成时间    |    是否完成    |    花费时间    |'];
    egmenu.style.fontSize = '14px';
    egmenu.style.marginBottom = '6px';
    egmenu.style.color = '#000'; // 改为黑色
    recordsMenu.appendChild(egmenu);

    var boardtimeInput = document.createElement('input');
    boardtimeInput.type = 'text';
    boardtimeInput.id = 'board-time-Input';
    boardtimeInput.placeholder = languageMap[currentLanguage]['例子：| 上机 | 1600 | √ | 60 |'];
    boardtimeInput.style.width = '100%';
    boardtimeInput.style.marginBottom = '4px';
    recordsMenu.appendChild(boardtimeInput);

    var taxitimeInput = document.createElement('input');
    taxitimeInput.type = 'text';
    taxitimeInput.id = 'taxi-time-Input';
    taxitimeInput.placeholder = languageMap[currentLanguage]['例子：| 起飞前滑行 | 1610 | √ | 10 |'];
    taxitimeInput.style.width = '100%';
    taxitimeInput.style.marginBottom = '4px';
    recordsMenu.appendChild(taxitimeInput);

    var takeofftimeInput = document.createElement('input');
    takeofftimeInput.type = 'text';
    takeofftimeInput.id = 'take-off-time-Input';
    takeofftimeInput.placeholder = languageMap[currentLanguage]['例子：| 起飞 | 1615 | √ | -- |'];
    takeofftimeInput.style.width = '100%';
    takeofftimeInput.style.marginBottom = '4px';
    recordsMenu.appendChild(takeofftimeInput);

    var cruisetimeInput = document.createElement('input');
    cruisetimeInput.type = 'text';
    cruisetimeInput.id = 'cruise-time-Input';
    cruisetimeInput.placeholder = languageMap[currentLanguage]['例子：| 巡航 | 1715 | √ | 35 |'];
    cruisetimeInput.style.width = '100%';
    cruisetimeInput.style.marginBottom = '4px';
    recordsMenu.appendChild(cruisetimeInput);

    var landingtimeInput = document.createElement('input');
    landingtimeInput.type = 'text';
    landingtimeInput.id = 'landing-time-Input';
    landingtimeInput.placeholder = languageMap[currentLanguage]['例子：| 降落 | 1718 | √ | -- |'];
    landingtimeInput.style.width = '100%';
    landingtimeInput.style.marginBottom = '4px';
    recordsMenu.appendChild(landingtimeInput);

    var taxi2timeInput = document.createElement('input');
    taxi2timeInput.type = 'text';
    taxi2timeInput.id = 'taxi-2-time-Input';
    taxi2timeInput.placeholder = languageMap[currentLanguage]['例子：| 降落后滑行 | 1728 | √ | 10 |'];
    taxi2timeInput.style.width = '100%';
    taxi2timeInput.style.marginBottom = '4px';
    recordsMenu.appendChild(taxi2timeInput);

    var parkingtimeInput = document.createElement('input');
    parkingtimeInput.type = 'text';
    parkingtimeInput.id = 'parking-time-Input';
    parkingtimeInput.placeholder = languageMap[currentLanguage]['例子：| 停机 | 1729 | √ | -- |'];
    parkingtimeInput.style.width = '100%';
    parkingtimeInput.style.marginBottom = '4px';
    recordsMenu.appendChild(parkingtimeInput);

    var deplanetimeInput = document.createElement('input');
    deplanetimeInput.type = 'text';
    deplanetimeInput.id = 'deplane-time-Input';
    deplanetimeInput.placeholder = languageMap[currentLanguage]['例子：| 下机 | 1800 | √ | 31 |'];
    deplanetimeInput.style.width = '100%';
    deplanetimeInput.style.marginBottom = '8px';
    recordsMenu.appendChild(deplanetimeInput);

    // 导出按钮
    var exportButton = document.createElement('button');
    exportButton.type = 'button';
    exportButton.id = 'export-json-button';
    exportButton.textContent = languageMap[currentLanguage]['导出航班记录'];
    exportButton.style.width = '48%';
    exportButton.style.padding = '8px';
    exportButton.style.marginTop = '6px';
    exportButton.style.cursor = 'pointer';
    exportButton.style.marginRight = '4%';
    recordsMenu.appendChild(exportButton);

    // 导入按钮
    var importButton = document.createElement('button');
    importButton.type = 'button';
    importButton.id = 'import-json-button';
    importButton.textContent = languageMap[currentLanguage]['导入航班记录'];
    importButton.style.width = '48%';
    importButton.style.padding = '8px';
    importButton.style.marginTop = '6px';
    importButton.style.cursor = 'pointer';
    recordsMenu.appendChild(importButton);

    // 隐藏文件输入，用于选择 .json
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.style.display = 'none';
    fileInput.id = 'import-file-input';
    document.body.appendChild(fileInput);

    // 状态区域（简易提示）
    var statusDiv = document.createElement('div');
    statusDiv.id = 'records-status';
    statusDiv.style.fontSize = '12px';
    statusDiv.style.color = '#333';
    statusDiv.style.marginTop = '8px';
    recordsMenu.appendChild(statusDiv);

    function toggleMenu() {
        var menu = document.getElementById('records-menu');
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    }

    // Add Visit the author section
    var visitAuthorSection = document.createElement('div');
    visitAuthorSection.id = 'visit-author-section';
    visitAuthorSection.style.marginTop = '12px';
    visitAuthorSection.style.textAlign = 'center';
    visitAuthorSection.style.fontSize = '12px';
    visitAuthorSection.style.color = '#666';
    recordsMenu.appendChild(visitAuthorSection);

    var visitAuthorTitle = document.createElement('h3');
    visitAuthorTitle.textContent = languageMap[currentLanguage]['查看作者'];
    visitAuthorTitle.style.marginBottom = '5px';
    visitAuthorSection.appendChild(visitAuthorTitle);

    var bilibiliLink = document.createElement('img');
    bilibiliLink.src = 'https://i.ibb.co/WBXZKn9/bl.png';
    bilibiliLink.alt = 'Bilibili Link';
    bilibiliLink.style.width = '45px';
    bilibiliLink.style.height = 'auto';
    bilibiliLink.style.marginRight = '10px';
    bilibiliLink.style.cursor = 'pointer';
    bilibiliLink.addEventListener('click', function() {
        window.open('https://space.bilibili.com/3546746969917664?spm_id_from=333.1007.0.0', '_blank');
    });
    visitAuthorSection.appendChild(bilibiliLink);

    var XiaohongshuLink = document.createElement('img');
    XiaohongshuLink.src = 'https://kkimgs.yisou.com/ims?kt=url&at=ori&key=aHR0cHM6Ly9nZC1oYmltZy5odWFiYW4uY29tLzM3ZTExN2Q5NTMyMzRiZTIwNWVkNjc1MTA4Y2MyYjE0YTA5YmY1MTk3NTEzLUxaeGZhVV9mdzY1OHdlYnA=&sign=yx:u_y-cWwaQKX3p7VBMONcYApvB4c=&tv=0_0';
    XiaohongshuLink.alt = 'Xiaohongshu Link';
    XiaohongshuLink.style.width = '45px';
    XiaohongshuLink.style.height = 'auto';
    XiaohongshuLink.style.cursor = 'pointer';
    XiaohongshuLink.addEventListener('click', function() {
        window.open('https://www.xiaohongshu.com/user/profile/67f26ec0000000000e011a93', '_blank');
    });
    visitAuthorSection.appendChild(XiaohongshuLink);

    var GithubLink = document.createElement('img');
    GithubLink.src = 'https://kkimgs.yisou.com/ims?kt=url&at=ori&key=aHR0cHM6Ly9ia2ltZy5jZG4uYmNlYm9zLmNvbS9waWMvZjYzNmFmYzM3OTMxMGE1NWIzMTkwOTE5NDgxMzU0YTk4MjI2Y2VmY2JhOWQ=&sign=yx:QpJGpxLIDm1YFkekJwiiD72Dzpw=&tv=0_0';
    GithubLink.alt = 'Github Link';
    GithubLink.style.width = '45px';
    GithubLink.style.height = 'auto';
    GithubLink.style.cursor = 'pointer';
    GithubLink.addEventListener('click', function() {
        window.open('https://github.com/zssszscnplane', '_blank');
    });
    visitAuthorSection.appendChild(GithubLink);


    soundButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'y') {
            toggleMenu();
        }
    });

    // 将所有文本框数据收集并导出为 JSON 文件
    function exportRecordsToJSON() {
        var data = {
            meta: {
                exportedAt: new Date().toISOString(),
                source: 'GeoFS Flight Records Addon'
            },
            flight: {
                from: fromInput.value || '',
                destination: destinationInput.value || '',
                flightNumber: flightnumberInput.value || ''
            },
            timeline: [
                { key: '上机', value: boardtimeInput.value || '' },
                { key: '起飞前滑行', value: taxitimeInput.value || '' },
                { key: '起飞', value: takeofftimeInput.value || '' },
                { key: '巡航', value: cruisetimeInput.value || '' },
                { key: '降落', value: landingtimeInput.value || '' },
                { key: '降落后滑行', value: taxi2timeInput.value || '' },
                { key: '停机', value: parkingtimeInput.value || '' },
                { key: '下机', value: deplanetimeInput.value || '' }
            ]
        };

        var jsonStr = JSON.stringify(data, null, 2);
        var blob = new Blob([jsonStr], { type: 'application/json' });
        var url = URL.createObjectURL(blob);

        var filenameBase = 'geoFS_flight';
        if (flightnumberInput.value) {
            // sanitize filename part
            var fn = flightnumberInput.value.replace(/[^a-zA-Z0-9-_]/g, '_');
            filenameBase += '_' + fn;
        }
        var timestamp = new Date().toISOString().slice(0,19).replace(/[:T]/g, '-');
        var filename = filenameBase + '_' + timestamp + '.json';

        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
        statusDiv.textContent = (languageMap[currentLanguage]['Exported: '] || '') + filename;
    }

    exportButton.addEventListener('click', function() {
        exportRecordsToJSON();
    });

    // 填充数据到界面
    function populateFromData(data) {
        if (!data || typeof data !== 'object') throw new Error('invalid data');

        // flight 字段（兼容旧/新导出格式）
        if (data.flight && typeof data.flight === 'object') {
            fromInput.value = data.flight.from || '';
            destinationInput.value = data.flight.destination || '';
            flightnumberInput.value = data.flight.flightNumber || data.flight.flightNo || data.flight.flight || '';
        }

        // timeline: 支持数组 [{key,value}] 或 对象 { "上机":"1600", ... }
        if (Array.isArray(data.timeline)) {
            data.timeline.forEach(function(item) {
                if (!item || typeof item !== 'object') return;
                var k = (item.key || '').toString();
                var v = (item.value || '').toString();
                assignTimelineValue(k, v);
            });
        } else if (data.timeline && typeof data.timeline === 'object') {
            Object.keys(data.timeline).forEach(function(k) {
                assignTimelineValue(k, data.timeline[k]);
            });
        }

        // 兼容直接把字段放在根级别
        var directMap = {
            '上机': 'board-time-Input',
            '起飞前滑行': 'taxi-time-Input',
            '起飞': 'take-off-time-Input',
            '巡航': 'cruise-time-Input',
            '降落': 'landing-time-Input',
            '降落后滑行': 'taxi-2-time-Input',
            '停机': 'parking-time-Input',
            '下机': 'deplane-time-Input'
        };
        Object.keys(directMap).forEach(function(k) {
            if (data.hasOwnProperty(k)) {
                document.getElementById(directMap[k]).value = data[k] || '';
            }
        });
    }

    function assignTimelineValue(key, value) {
        if (!key) return;
        key = key.toString().trim();
        var v = value == null ? '' : value.toString();
        switch (key) {
            case '上机':
            case 'boarding':
            case 'board':
                boardtimeInput.value = v;
                break;
            case '起飞前滑行':
            case 'taxi_before_takeoff':
            case 'taxi_before':
                taxitimeInput.value = v;
                break;
            case '起飞':
            case 'takeoff':
                takeofftimeInput.value = v;
                break;
            case '巡航':
            case 'cruise':
                cruisetimeInput.value = v;
                break;
            case '降落':
            case 'landing':
                landingtimeInput.value = v;
                break;
            case '降落后滑行':
            case 'taxi_after_landing':
                taxi2timeInput.value = v;
                break;
            case '停机':
            case 'parking':
                parkingtimeInput.value = v;
                break;
            case '下机':
            case 'deplane':
            case 'disembark':
                deplanetimeInput.value = v;
                break;
            default:
                console.log('Unknown timeline key:', key, 'value:', v);
        }
    }

    // 处理文件选择并导入
    fileInput.addEventListener('change', function(evt) {
        var file = fileInput.files && fileInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var text = e.target.result;
                var parsed = JSON.parse(text);
                populateFromData(parsed);
                statusDiv.textContent = languageMap[currentLanguage]['导入成功'];
            } catch (err) {
                console.error(err);
                statusDiv.textContent = languageMap[currentLanguage]['导入失败: 非法 JSON 或 结构不匹配'];
                alert(languageMap[currentLanguage]['导入失败: 非法 JSON 或 结构不匹配']);
            } finally {
                fileInput.value = '';
            }
        };
        reader.onerror = function(err) {
            console.error('File read error', err);
            statusDiv.textContent = languageMap[currentLanguage]['导入失败: 非法 JSON 或 结构不匹配'];
            fileInput.value = '';
        };
        reader.readAsText(file, 'utf-8');
    });

    // 点击导入按钮触发文件选择
    importButton.addEventListener('click', function() {
        fileInput.click();
    });

    // --- 新增：语言切换逻辑 ---
    function setLanguage(lang) {
        if (!languageMap[lang]) return;
        currentLanguage = lang;

        // update top/button labels (note: setLanguage will update the button text when language changes)
        soundButton.textContent = languageMap[currentLanguage]['GeoFS 航线记录'];
        menuTitle.textContent = languageMap[currentLanguage]['GeoFS 航线记录'];
        menuSubtitle.textContent = languageMap[currentLanguage]['由 Bilibili-我是小猪05 Xiaohongshu-起飞吧！凤凰牌飞机！ Github-zssszscnplane 制作'];
        Idonnmenu.textContent = '-------------' + languageMap[currentLanguage]['GeoFS 航线记录'] + '----------------';
        visitAuthorTitle.textContent = languageMap[currentLanguage]['查看作者'];

        // inputs placeholders
        fromInput.placeholder = languageMap[currentLanguage]['始发地(ICTO)'];
        destinationInput.placeholder = languageMap[currentLanguage]['目的地(ICTO)'];
        flightnumberInput.placeholder = languageMap[currentLanguage]['航班号'];
        egmenu.textContent = languageMap[currentLanguage]['|    状态    |    完成时间    |    是否完成    |    花费时间    |'];
        boardtimeInput.placeholder = languageMap[currentLanguage]['例子：| 上机 | 1600 | √ | 60 |'];
        taxitimeInput.placeholder = languageMap[currentLanguage]['例子：| 起飞前滑行 | 1610 | √ | 10 |'];
        takeofftimeInput.placeholder = languageMap[currentLanguage]['例子：| 起飞 | 1615 | √ | -- |'];
        cruisetimeInput.placeholder = languageMap[currentLanguage]['例子：| 巡航 | 1715 | √ | 35 |'];
        landingtimeInput.placeholder = languageMap[currentLanguage]['例子：| 降落 | 1718 | √ | -- |'];
        taxi2timeInput.placeholder = languageMap[currentLanguage]['例子：| 降落后滑行 | 1728 | √ | 10 |'];
        parkingtimeInput.placeholder = languageMap[currentLanguage]['例子：| 停机 | 1729 | √ | -- |'];
        deplanetimeInput.placeholder = languageMap[currentLanguage]['例子：| 下机 | 1800 | √ | 31 |'];

        // buttons
        exportButton.textContent = languageMap[currentLanguage]['导出航班记录'];
        importButton.textContent = languageMap[currentLanguage]['导入航班记录'];

        // status clear (or keep existing)
        statusDiv.textContent = '';
    }

    zhBtn.addEventListener('click', function() {
        setLanguage('简体中文');
        langOptions.style.display = 'none';
    });

    enBtn.addEventListener('click', function() {
        setLanguage('English');
        langOptions.style.display = 'none';
    });

    // 初始化语言（确保界面文本与 currentLanguage 一致）
    setLanguage(currentLanguage);

})();
