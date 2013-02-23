var hex_size = 35;
var hex_width = (Math.cos(Math.PI / 6) * hex_size * 2);
var hex_height = Math.sin(Math.PI / 6) * hex_size + hex_size;

function hexCenter(row, col) {
    var x_offset = row % 2 ? hex_width / 2 : 0;
    var x = 5 + hex_size + col * hex_width + x_offset,
        y = 5 + hex_size + row * hex_height;
    return [x, y];
}

var colors = {
    red: '#e04040',
    green: '#40a040',
    yellow: '#e0e040',
    brown: '#a06040',
    blue: '#2080f0',
    black: '#000000',
    white: '#ffffff',
    gray: '#808080',
    orange: '#f0c040'
};

var bgcolors = {
    red: '#f08080',
    green: '#80f080',
    yellow: '#f0f080',
    blue: '#60c0f0',
    black: '#404040',
    white: '#ffffff',
    gray: '#c0c0c0',
    brown: '#b08040'
};

var cult_bgcolor = {
    FIRE: "#f88",
    WATER: "#ccf",
    EARTH: "#b84",
    AIR: "#f0f0f0"
};

function drawText(ctx, text, x, y, font) {
    ctx.save();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 0.1;
    ctx.font = font;
    ctx.fillText(text, x, y);
    ctx.strokeText(text, x, y);            
    ctx.restore();    
}

function makeHexPath(ctx, hex) {
    var loc = hexCenter(hex.row, hex.col);
    var x = loc[0] - Math.cos(Math.PI / 6) * hex_size;
    var y = loc[1] + Math.sin(Math.PI / 6) * hex_size;
    var angle = 0;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (var i = 0; i < 6; i++) {
        ctx.lineTo(x, y); 
        angle += Math.PI / 3;
        x += Math.sin(angle) * hex_size;
        y += Math.cos(angle) * hex_size;        
    }
    ctx.closePath();
}

function fillBuilding(ctx, hex) {
    ctx.fillStyle = colors[hex.color];
    ctx.fill();

    if (hex.color == "black") {
        ctx.strokeStyle = '#808080';
    } else {
        ctx.strokeStyle = '#000';
    }
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawDwelling(ctx, hex) {
    var loc = hexCenter(hex.row, hex.col);

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(loc[0], loc[1] - 10);
    ctx.lineTo(loc[0] + 10, loc[1]);
    ctx.lineTo(loc[0] + 10, loc[1] + 10);
    ctx.lineTo(loc[0] - 10, loc[1] + 10);
    ctx.lineTo(loc[0] - 10, loc[1]);
    ctx.closePath();

    fillBuilding(ctx, hex);

    ctx.restore();
}

function drawTradingPost(ctx, hex) {
    var loc = hexCenter(hex.row, hex.col);

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(loc[0], loc[1] - 20);
    ctx.lineTo(loc[0] + 10, loc[1] - 10);
    ctx.lineTo(loc[0] + 10, loc[1] - 3);
    ctx.lineTo(loc[0] + 20, loc[1] - 3);
    ctx.lineTo(loc[0] + 20, loc[1] + 10);
    ctx.lineTo(loc[0] - 10, loc[1] + 10);
    ctx.lineTo(loc[0] - 10, loc[1]);
    ctx.lineTo(loc[0] - 10, loc[1] - 10);
    ctx.closePath();

    fillBuilding(ctx, hex);

    ctx.restore();
}

function drawTemple(ctx, hex) {
    var loc = hexCenter(hex.row, hex.col);
    loc[1] -= 5;

    ctx.save();

    ctx.beginPath();
    ctx.arc(loc[0], loc[1], 14, 0, Math.PI*2, false);

    fillBuilding(ctx, hex);

    ctx.restore();
}


function drawStronghold(ctx, hex) {
    var loc = hexCenter(hex.row, hex.col);
    loc[1] -= 5;
    var size = 15;
    var bend = 10;

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(loc[0] - size, loc[1] - size);
    ctx.quadraticCurveTo(loc[0] - bend, loc[1],
                         loc[0] - size, loc[1] + size);
    ctx.quadraticCurveTo(loc[0], loc[1] + bend,
                         loc[0] + size, loc[1] + size);
    ctx.quadraticCurveTo(loc[0] + bend, loc[1],
                         loc[0] + size, loc[1] - size);
    ctx.quadraticCurveTo(loc[0], loc[1] - bend,
                         loc[0] - size, loc[1] - size);

    fillBuilding(ctx, hex);

    ctx.restore();
}

function drawSanctuary(ctx, hex) {
    var loc = hexCenter(hex.row, hex.col);
    var size = 7;
    loc[1] -= 5;

    ctx.save();

    ctx.beginPath();
    ctx.arc(loc[0] - size, loc[1], 12, Math.PI / 2, -Math.PI / 2, false);
    ctx.arc(loc[0] + size, loc[1], 12, -Math.PI / 2, Math.PI / 2, false);
    ctx.closePath();
    
    fillBuilding(ctx, hex);

    ctx.restore();
}

function drawHex(ctx, elem) {
    if (elem == null) {
        return;
    }

    var hex = elem.value;
    var id = elem.key;

    if (hex.row == null) {
        return;
    }

    if (hex.color == 'white') {
        return;
    }

    makeHexPath(ctx, hex);

    ctx.save();
    ctx.fillStyle = bgcolors[hex.color];
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    makeHexPath(ctx, hex);
    ctx.stroke();
    ctx.restore();

    if (hex.building == 'D') {
        drawDwelling(ctx, hex);
    } else if (hex.building == 'TP' || hex.building == 'TH') {
        drawTradingPost(ctx, hex);
    } else if (hex.building == 'TE') {
        drawTemple(ctx, hex);
    } else if (hex.building == 'SH') {
        drawStronghold(ctx, hex);
    } else if (hex.building == 'SA') {
        drawSanctuary(ctx, hex);
    }

    ctx.save();
    var loc = hexCenter(hex.row, hex.col);
    if (hex.color == "black") {
        ctx.strokeStyle = "#c0c0c0";
    } else {
        ctx.strokeStyle = "#000";
    }
    drawText(ctx, id, loc[0] - 9, loc[1] + 25,
             hex.town ? "bold 12px Verdana" : "12px Verdana");
    ctx.restore();
}

function drawBridge(ctx, from, to, color) {
    var from_loc = hexCenter(state.map[from].row, state.map[from].col);
    var to_loc = hexCenter(state.map[to].row, state.map[to].col);

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(from_loc[0], from_loc[1]);
    ctx.lineTo(to_loc[0], to_loc[1]);

    ctx.strokeStyle = '#222';
    ctx.lineWidth = 10;
    ctx.stroke();
    
    ctx.strokeStyle = colors[color];
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.restore();
}

function drawMap() {
    var canvas = $("map");
    if (canvas.getContext) {
        canvas.width = canvas.width;
        var ctx = canvas.getContext("2d");

        state.bridges.each(function(bridge, index) {
            drawBridge(ctx, bridge.from, bridge.to, bridge.color);
        });

        $H(state.map).each(function(hex, index) { drawHex(ctx, hex) });
    }
}

function drawCults() {
    var canvas = $("cults");
    if (canvas.getContext) {
        canvas.width = canvas.width;
        var ctx = canvas.getContext("2d");

        var cults = ["FIRE", "WATER", "EARTH", "AIR"];
        var x_offset = 0;

        var width = 250 / 4;
        var height = 500;

        for (var j = 0; j < 4; ++j) {
            var cult = cults[j];

            ctx.save();

            ctx.translate(width * j, 0);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, height);
            ctx.lineTo(width, height);
            ctx.lineTo(width, 0);
            ctx.closePath();
            ctx.fillStyle = cult_bgcolor[cult];
            ctx.fill();

            drawText(ctx, cult, 5, 15, "15px Verdana");

            ctx.translate(0, 20);

            for (var i = 0; i <= 10; ++i) {
                ctx.save();
                ctx.translate(0, ((10 - i) * 40 + 20));

                drawText(ctx, i, 5, 0, "15px Verdana");

                state.order.each(function(name, index) {
                    var faction = state.factions[name];
                    if (faction[cult] != i) {
                        return;
                    }

                    ctx.translate(9, 0);

                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(0, 10, 6, Math.PI * 2, 0, false);
                    ctx.fillStyle = colors[faction.color];
                    ctx.fill();
                    ctx.stroke()
                    ctx.restore();
                });

                ctx.restore();
            }

            ctx.save();
            ctx.translate(5, 470);
            ctx.font = "15px Verdana";
            ctx.lineWidth = 0.2;

            for (var i = 1; i < 5; ++i) {
                var text = (i == 1 ? 3 : 2);
                ctx.fillStyle = "#000";
                ctx.strokeStyle = "#000";

                var slot = state.map[cult + i];

                if (slot.building) {
                    text = "p";
                    ctx.fillStyle = colors[slot.color];
                    ctx.strokeStyle = colors[slot.color];
                }
                ctx.fillText(text, 0, 0);
                ctx.strokeText(text, 0, 0);

                ctx.translate(12, 0);
            }
            ctx.restore();

            ctx.restore();
        };

        ctx.save();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.translate(0, 60.5);
        ctx.moveTo(0, 0); ctx.lineTo(250, 0);
        ctx.moveTo(0, 3); ctx.lineTo(250, 3);
        ctx.moveTo(0, 6); ctx.lineTo(250, 6);

        ctx.translate(0, 120);
        ctx.moveTo(0, 0); ctx.lineTo(250, 0);
        ctx.moveTo(0, 3); ctx.lineTo(250, 3);

        ctx.translate(0, 80);
        ctx.moveTo(0, 0); ctx.lineTo(250, 0);
        ctx.moveTo(0, 3); ctx.lineTo(250, 3);

        ctx.translate(0, 80);
        ctx.moveTo(0, 0); ctx.lineTo(250, 0);

        ctx.stroke();
        ctx.restore();
    }
}

function renderAction(canvas, name, key) {
    if (!canvas.getContext) {
        return;
    }

    var ctx = canvas.getContext("2d");

    ctx.save();
    ctx.translate(2, 2);

    if (state.map[key] && state.map[key].blocked) {
        ctx.fillStyle = '#ccc';
    } else {
        ctx.fillStyle = colors.orange;
    }
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    ctx.translate(0.5, 0.5);
    ctx.moveTo(0, 10);
    ctx.lineTo(10, 0);
    ctx.lineTo(20, 0);
    ctx.lineTo(30, 10);
    ctx.lineTo(30, 20);
    ctx.lineTo(20, 30);
    ctx.lineTo(10, 30);
    ctx.lineTo(0, 20);
    ctx.lineTo(0, 10);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    if (!name.startsWith("FAV") && !name.startsWith("BON")) {
        drawText(ctx, name, 1, 45, "10px Verdana");
    }

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var data = {
        "ACT1": function() {
            drawText(ctx, "br", 15, 15, "10px Verdana");
            drawText(ctx, "-3PW", 15, 55, "10px Verdana");
        },
        "ACT2": function() {
            drawText(ctx, "P", 15, 15, "10px Verdana");
            drawText(ctx, "-3PW", 15, 55, "10px Verdana");
        },
        "ACT3": function() {
            drawText(ctx, "2W", 15, 15, "10px Verdana");
            drawText(ctx, "-4PW", 15, 55, "10px Verdana");
        },
        "ACT4": function() {
            drawText(ctx, "7C", 15, 15, "10px Verdana");
            drawText(ctx, "-4PW", 15, 55, "10px Verdana");
        },
        "ACT5": function() {
            drawText(ctx, "spd", 15, 15, "10px Verdana");
            drawText(ctx, "-4PW", 15, 55, "10px Verdana");
        },
        "ACT6": function() {
            drawText(ctx, "2 spd", 15, 15, "10px Verdana");
            drawText(ctx, "-6PW", 15, 55, "10px Verdana");
        },
        "ACTA": function() {
            drawText(ctx, "2cult", 15, 15, "10px Verdana");
        },
        "ACTN": function() {
            drawText(ctx, "tf", 15, 15, "10px Verdana");
        },
        "ACTS": function() {
            drawText(ctx, "TP", 15, 15, "10px Verdana");
        },
        "ACTW": function() {
            drawText(ctx, "D", 15, 15, "10px Verdana");
        },
        "BON1": function() {
            drawText(ctx, "spd", 15, 15, "10px Verdana");
        },
        "BON2": function() {
            drawText(ctx, "cult", 15, 15, "10px Verdana");
        },
        "FAV6": function() {
            drawText(ctx, "cult", 15, 15, "10px Verdana");
        }
    };

    if (data[name]) {
        data[name]();
    }

    ctx.restore();

    ctx.restore();
}

function cultStyle(name) {
    if (cult_bgcolor[name]) {
        return "style='background-color:" + cult_bgcolor[name] + "'";
    }

    return "";
}

function insertAction(parent, name, key) {
    parent.insert(new Element('canvas', {
        'class': 'action', 'width': 40, 'height': 80}));
    var canvas = parent.childElements().last();
    renderAction(canvas, name, key);
}

function renderTile(div, name, record, faction, count) {
    div.insert(name);
    if (state.map[name] && state.map[name].C) {
        div.insert(" [#{C}c]".interpolate(state.map[name]));
    }
    if (count > 1) {
        div.insert("(x" + count + ")");
    }
    div.insert("<hr>");

    if (!record) {
        return;
    }

    $H(record.gain).each(function (elem, index) {
        elem.style = cultStyle(elem.key);
        div.insert("<div><span #{style}>#{value} #{key}</span></div>".interpolate(elem));
    });
    $H(record.vp).each(function (elem, index) {
        div.insert("<div>#{key} &gt;&gt; #{value} vp</div>".interpolate(elem));
    });
    $H(record.pass_vp).each(function (elem, index) {
        var stride = elem.value[1] - elem.value[0];
        for (var i = 1; i < elem.value.length; ++i) {
            if (elem.value[i-1] + stride != elem.value[i]) {
                stride = null;
                break;
            }
        }

        if (stride) {
            elem.value = "*" + stride;
        } else {
            elem.value = " [" + elem.value + "]";
        }

        div.insert("<div>pass-vp:#{key}#{value}</div>".interpolate(elem));
    });
    if (record.action) {
        insertAction(div, name, name + "/" + faction);
    }
    $H(record.income).each(function (elem, index) {
        div.insert("<div>+#{value} #{key}</div>".interpolate(elem));
    });
    $H(record.special).each(function (elem, index) {
        div.insert("<div>#{value} #{key}</div>".interpolate(elem));
    });
}

function renderBonus(div, name, faction) {
    renderTile(div, name, state.bonus_tiles[name], faction, 1);
}

function renderFavor(div, name, faction, count) {
    renderTile(div, name, state.favors[name], faction, count);
}

function renderTown(div, name, faction, count) {
    if (count != 1) {
        div.insert(name + " (x" + count + ")");
    } else {
        div.insert(name);
    }

    div.insert("<div>#{VP} vp</div>".interpolate(state.towns[name].gain));
    $H(state.towns[name].gain).each(function(elem, index) {
        var key = elem.key;
        var value = elem.value;
        elem.style = cultStyle(key);

        if (key != "VP" && key != "KEY") {
            div.insert("<div><span #{style}>#{value} #{key}</span></div>".interpolate(elem));
        }
    });
}

function naturalSortKey(val) {
    if (val.key == "FAV10") {
        return "FAVA";
    }
    if (val.key == "FAV11") {
        return "FAVB";
    }
    if (val.key == "FAV12") {
        return "FAVC";
    }

    return val.key;
}

function renderTreasury(board, treasury, faction) {
    $H(treasury).sortBy(naturalSortKey).each(function(elem, index) {
        var name = elem.key;
        var value = elem.value;

        if (value < 1) {
            return;
        }

        if (name.startsWith("ACT")) {
            insertAction(board, name, name);
            return;
        } else if (name.startsWith("BON")) {
            board.insert(new Element('div', {
                'class': 'bonus'}));
            var div = board.childElements().last();
            renderBonus(div, name, faction);            
        } else if (name.startsWith("FAV")) {
            board.insert(new Element('div', {
                'class': 'favor'}));
            var div = board.childElements().last();
            renderFavor(div, name, faction, value);
            return;
        } else if (name.startsWith("TW")) {
            board.insert(new Element('div', {
                'class': 'town'}));
            var div = board.childElements().last();
            renderTown(div, name, faction, value);
            return;
        }
    });
}

function makeBoard(color, name, klass, style) {
    var board = new Element('div', {
        'class': klass,
        'style': style
    });
    board.insert(new Element('div', {
        'style': 'padding: 1px 1px 1px 5px; background-color: ' + colors[color] + '; color: ' +
            (color == 'black' ? '#ccc' : '#000')
    }).update(name));

    return board;
}

var cycle = [ "red", "yellow", "brown", "black", "blue", "green", "gray" ]; 

function renderColorCycle(parent, startColor) {
    parent.insert(new Element('canvas', {
        'class': 'colorcycle', 'width': 80, 'height': 80}));
    var canvas = parent.childElements().last();

    if (!canvas.getContext) {
        return;
    }

    var ctx = canvas.getContext("2d");

    ctx.save()
    ctx.translate(40, 41);

    var base = cycle.indexOf(startColor);

    for (var i = 0; i < 7; ++i) {
        ctx.save()
        ctx.beginPath();
        ctx.arc(0, -30, 10, Math.PI * 2, 0, false);

        ctx.fillStyle = bgcolors[cycle[(base + i) % 7]];
        ctx.fill();
    
        ctx.stroke();
        ctx.restore();
        ctx.rotate(Math.PI * 2 / 7);
    }

    ctx.restore();
}

function rowFromArray(array, style) {
    var tr = new Element("tr", {'style': style});
    array.each(function(elem) {
        tr.insert(new Element("td").update(elem));
    });

    return tr;
}

function toggleIncome(id) {
    var table = $(id);

    table.childElements().each(function (elem, index) {
        if (index != 0) {
            elem.style.display = (elem.style.display == 'none' ? '' : 'none');
        }
    });
}

function toggleBuildings(id) {
    var table = $(id);

    table.childElements().each(function (elem, index) {
        if (index > 1) {
            elem.style.display = (elem.style.display == 'none' ? '' : 'none');
        }
    });
}

function toggleVP(id) {
    $(id).style.display = ($(id).style.display == 'none' ? '' : 'none');
}

function drawFactions() {
    $("factions").innerHTML = "";

    state.order.each(function(name) {
        name = name;
        var faction = state.factions[name];
        var color = faction.color;
        var title = faction.display;

        var style ='float: left; margin-right: 20px; ';
        if (faction.passed) {
            style += 'opacity: 0.5';
            title += ", passed";
        }

        if (faction.start_player) {
            title += ", start player";
        }

        var container = new Element('div', { 'class': 'faction-board' });
        var board = makeBoard(color, title, '', style);
        container.insert(board);
        var info = new Element('div', {'class': 'faction-info' });
        board.insert(info);

        if (faction.vp_source) {
            var vp_id = faction.name + "/vp";
            var vp_breakdown = new Element('table', {'id': vp_id,
                                                     'style': 'display: none',
                                                     'class': 'vp-breakdown'});
            board.insert(vp_breakdown);
            vp_breakdown.insert("<tr><td colspan=2><b>VP breakdown</b></td></tr>")
            $H(faction.vp_source).sortBy(function(a) { return -a.value}).each(function(record) {
                vp_breakdown.insert("<tr><td>#{key}<td>#{value}</tr>".interpolate(record));
            });
        }

        faction.vp_id = vp_id;
        info.insert(new Element('div').update(
            "#{C} c, #{W} w, #{P}<span style='color:#888'>/#{MAX_P}</span> p, <a href='javascript:toggleVP(\"#{name}/vp\")'>#{VP} vp</a>, #{P1}/#{P2}/#{P3} pw".interpolate(faction)));
        info.insert(new Element('div').update(
            "dig level #{dig.level}, ship level #{ship.level}".interpolate(faction)));

        info.insert("<div></div>");

        var buildings_id = "buildings-" + name;
        var buildings = new Element('table', {'class': 'building-table', 'id': buildings_id});
        info.insert(buildings);

        var b = ['D', 'TP', 'TE', 'SH', 'SA'];
        var count = [];
        var cost = [];

        b.each(function(key) {
            record = faction.buildings[key];
            record.key = key;
            var text = "#{level}/#{max_level}".interpolate(record);
            if (record.level == record.max_level && record.max_level > 3) {
                text = "<span style='color: red'>" + text + "</span>";
            }
            count.push(text);
            cost.push("#{advance_cost.C}c,&#160;#{advance_cost.W}w".interpolate(record));
        });

        buildings.insert(rowFromArray(b, '').insert("<td><a href='javascript:toggleBuildings(\"" + buildings_id + "\")'>+</a>"));
        buildings.insert(rowFromArray(count, ''));
        buildings.insert(rowFromArray(cost, 'display: none'));

        var income_id = "income-" + name;
        var income = new Element('table', {'class': 'income-table', 'id': income_id});
        info.insert(income);

        if (faction.income) {
	    var row = new Element('tr');
	    row.update("<td>Income:<td>total<td>#{C}c<td>#{W}w<td>#{P}p<td>#{PW}pw".interpolate(faction.income));
	    row.insert(new Element('td').update("<a href='javascript:toggleIncome(\"" + income_id + "\")'>+</a>"));
            income.insert(row);
        }

        if (faction.income_breakdown) {
            income.insert(Element('tr', {'style': 'display: none'}).update("<td colspan=6><hr>"));
            $H(faction.income_breakdown).each(function(elem, ind) {
                if (!elem.value) {
                    return;
                }

                elem.value.key = elem.key;
                var row = new Element('tr', {'style': 'display: none'});
                income.insert(row.update("<td><td>#{key}<td>#{C}<td>#{W}<td>#{P}<td>#{PW}".interpolate(elem.value)));
            });
        }

        renderColorCycle(container, faction.color);
        renderTreasury(container, faction, name);
        
        $("factions").insert(container);
    });
    
    var pool = makeBoard("orange", "Pool", 'pool');
    renderTreasury(pool, state.pool, 'pool');
    $("factions").insert(pool);
}

function drawLedger() {
    var ledger = $("ledger");
    ledger.innerHTML = "";

    state.ledger.each(function(record, index) {
        if (record.comment) {
            ledger.insert("<tr><td><td colspan=13><b>" + 
                          record.comment.escapeHTML() +
                          "</b>" + 
                          "<td><a href='" + showHistory(index + 1) +
                          "'>show history</a></tr>");
        } else {
            record.bg = colors[state.factions[record.faction].color];
            record.fg = (record.bg == '#000000' ? '#ccc' : '#000');
            record.commands = record.commands.escapeHTML();
            var row = "<tr><td style='background-color:#{bg}; color: #{fg}'>#{faction}".interpolate(record);
            ["VP", "C", "W", "P", "PW", "CULT"].each(function(key) {
                var elem = record[key];
                if (key != "CULT") { elem.type = key };
                if (!elem.delta) {
                    elem.delta = '';
                } else if (elem.delta > 0) {
                    elem.delta = "+" + elem.delta;
                }
                row += "<td class='ledger-delta'>#{delta}<td class='ledger-value'>#{value}&#160;#{type}</span>".
                    interpolate(elem);
            });

            var leech = "";
            $H(record.leech).each(function (elem, index) {
                if (elem.key == "black") {
                    elem.color = "#aaa";
                } else {
                    elem.color = "#000";
                }
                elem.key = colors[elem.key];
                leech += "<span style='color: #{color}; background-color: #{key}'>#{value}</span>&#160;".interpolate(elem);
            });
            row += "<td class='ledger-delta'>" + leech;

            row += "<td class='ledger-delta'>#{commands}</tr>".interpolate(record);
            ledger.insert(row);
            if (record.warning) {
                ledger.insert("<tr><td colspan=14><td><span class='warning'>" + 
                              record.warning.escapeHTML() +
                              "</span></tr>")
            }
        }
    });
}

function showHistory(row) {
    var loc = document.location.href;
    loc = loc.replace(/;.*/, '');
    return loc + ";max-row=" + row;
}

function drawScoringTiles() {
    var container = $("scoring");
    container.innerHTML = "";

    state.score_tiles.each(function(record, index) {
        var style = '';
        if (record.active) {
            style = 'background-color: #d0ffd0';
        } else if (record.old) {
            style = 'opacity: 0.5';
        }
        var tile = new Element('div', {'class': 'scoring', 'style': style});
        tile.insert(new Element('div', {'style': 'float: right; border-style: solid; border-width: 1px; '}).update("r" + (index + 1)));
        tile.insert(new Element('div').update(
            "<div class='scoring-head'>vp:</div><div>#{vp_display}</div>".interpolate(record)));
	if (record.income_display) {
            record.style = cultStyle(record.cult);
            tile.insert(new Element('div').update(
                "<div class='scoring-head'>income:</div><div><span #{style}>#{income_display}</span></div>".interpolate(record)));
	}
        container.insert(tile);
    });
}

function coloredFactionSpan(faction_name) {
    record = {};
    record.bg = colors[state.factions[faction_name].color];
    record.fg = (record.bg == '#000000' ? '#ccc' : '#000');
    record.display = state.factions[faction_name].display;

    return "<span style='background-color:#{bg}; color: #{fg}'>#{display}</span>".interpolate(record);
}

function drawActionRequired() {
    var parent = $("action_required");

    if (!parent) {
        return;
    }

    parent.innerHTML = "";

    var needMoveEntry = false;

    state.action_required.each(function(record, index) {
        if (record.type == 'full') {
            record.pretty = 'should take an action';
        } else if (record.type == 'leech') {
            record.from_faction_span = coloredFactionSpan(record.from_faction);
            record.pretty = 'may gain #{amount} power from #{from_faction_span}'.interpolate(record);
            if (record.actual != record.amount) {
                record.pretty += " (actually #{actual} power)".interpolate(record);
            }
        } else if (record.type == 'transform') {
            if (record.amount == 1) {
                record.pretty = 'may use a spade'.interpolate(record);
            } else {
                record.pretty = 'may use #{amount} spades'.interpolate(record);
            }
        } else if (record.type == 'cult') {
            if (record.amount == 1) {
                record.pretty = 'may advance 1 step on a cult track'.interpolate(record);
            } else {
                record.pretty = 'may advance #{amount} steps on cult tracks'.interpolate(record);
            }
        } else if (record.type == 'town') {
            if (record.amount == 1) {
                record.pretty = 'may form a town'.interpolate(record);
            } else {
                record.pretty = 'may form #{amount} towns'.interpolate(record);
            }
        } else if (record.type == 'favor') {
            if (record.amount == 1) {
                record.pretty = 'may take a favor tile'.interpolate(record);
            } else {
                record.pretty = 'may take #{amount} favor tiles'.interpolate(record);
            }
        } else if (record.type == 'dwelling') {
            record.pretty = 'should place a dwelling';
        } else if (record.type == 'bonus') {
            record.pretty = 'should pick a bonus tile';
        } else if (record.type == 'gameover') {
            record.pretty = 'The game is over';
        } else {
            record.pretty = '?';
        }

	if (record.faction) {
            record.faction_span = coloredFactionSpan(record.faction);
	} else {
	    record.faction_span = "";
	}

        var row = new Element("div", {'style': 'margin: 3px'}).update("#{faction_span} #{pretty}</div>".interpolate(record));
        parent.insert(row);

        if (currentFaction && record.faction == currentFaction) {
            addFactionInput(parent, record, index);
            needMoveEntry = true;
        }
    });

    if (needMoveEntry && $(move_entry).innerHTML == "") {
        var input = new Element("textarea", {"id": "move_entry_input",
                                             "onInput": "javascript:moveEntryInputChanged()",
                                             "style": "font-family: monospace; width: 60ex; height: 6em;" } );
        $(move_entry).insert(input);
        $(move_entry).insert("<div style='padding-left: 2em'><button id='move_entry_action' onclick='javascript:save()'>Save</button></div>")
    }
}

function addFactionInput(parent, record, index) {
    if (record.type == "leech") {
        $(parent).insert("<div id='leech-" + index + "' style='padding-left: 2em'><button onclick='javascript:acceptLeech(" + index + ")'>Accept</a> <button onclick='javascript:declineLeech(" + index + ")'>Decline</button></div>")
    }
}

function acceptLeech(index) {
    var record = state.action_required[index];
    $("leech-" + index).style.display = "none";
    $(move_entry_input).value += "Leech #{amount} from #{from_faction}\n".interpolate(record);
        moveEntryInputChanged();
}

function declineLeech(index) {
    var record = state.action_required[index];
    $("leech-" + index).style.display = "none";
    $(move_entry_input).value += "Decline #{amount} from #{from_faction}\n".interpolate(record);
        moveEntryInputChanged();
}

function moveEntryInputChanged() {
    $(move_entry_input).oninput = null;
    $(move_entry_action).innerHTML = "Preview";
    $(move_entry_action).onclick = preview;
} 

function moveEntryAfterPreview() {
    if ($("move_entry_action")) {
        $("move_entry_action").disabled = false;

        if ($("error").innerHTML == "") {
            $("move_entry_action").innerHTML = "Save";
            $("move_entry_action").onclick = save;
        }
    }
    if ($("move_entry_input")) {
        $("move_entry_input").disabled = false;
        $("move_entry_input").oninput = moveEntryInputChanged;
    }
}

function draw() {
    $("error").innerHTML = "";
    state.error.each(function(row) {
        $("error").insert("<div>" + row.escapeHTML() + "</div>");
    });

    drawMap();
    drawCults();
    drawScoringTiles();
    drawActionRequired();
    drawFactions();
    drawLedger();

    if (state.history_view > 0) {
        $("root").style.backgroundColor = "#ffeedd";
    }
}

function failed() {
    $("action_required").innerHTML = "";
    if (state.error) {
        state.error.each(function(row) {
            $("error").insert("<div>" + row.escapeHTML() + "</div>");
        });
    } else {
        $("error").insert("Couldn't load game");
    }
}