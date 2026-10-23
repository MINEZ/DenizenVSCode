// 生成 README 顶部的 upstream 徽章。
//
// 版式与算法复刻 shields.io 的 flat 样式：文本宽度按 11px Verdana 的字宽表计算，因此同样的文字生成的 SVG 与 shields.io 逐字节一致。
// 打包扩展（vsce package）时经 vscode:prepublish 调用，徽章随 extension/package.json 中的版本号自动更新，无须手动维护；内容未变时不会改写文件。
'use strict';

const fs = require('fs');
const path = require('path');

const LABEL = 'upstream';

// 11px Verdana 下 ASCII 可打印字符（32 至 126）的字宽，取自 shields.io 所用的 anafanafo。
const WIDTHS = [
    3.87, 4.33, 5.05, 9, 6.99, 11.84, 7.99, 2.95, 5, 5, 6.99, 9, 4, 5, 4, 5, 6.99, 6.99, 6.99, 6.99,
    6.99, 6.99, 6.99, 6.99, 6.99, 6.99, 5, 5, 9, 9, 9, 6, 11, 7.52, 7.54, 7.68, 8.48, 6.96, 6.32, 8.53,
    8.27, 4.63, 5, 7.62, 6.12, 9.27, 8.23, 8.66, 6.63, 8.66, 7.65, 7.52, 6.78, 8.05, 7.52, 10.88, 7.54,
    6.77, 7.54, 5, 5, 5, 9, 6.99, 6.99, 6.61, 6.85, 5.73, 6.85, 6.55, 3.87, 6.85, 6.96, 3.02, 3.79,
    6.51, 3.02, 10.7, 6.96, 6.68, 6.85, 6.85, 4.69, 5.73, 4.33, 6.96, 6.51, 9, 6.51, 6.51, 5.78, 6.98,
    5, 6.98, 9
];

// 与 shields.io 相同：取整后向上凑成奇数，以便文字落在整像素上。
function preferredWidth(text) {
    let width = 0;
    for (const ch of text) {
        const code = ch.charCodeAt(0);
        // 字宽表以外的字符按 “m” 估算，与 shields.io 的回退方式一致。
        width += code >= 32 && code <= 126 ? WIDTHS[code - 32] : WIDTHS['m'.charCodeAt(0) - 32];
    }
    const floor = Math.floor(width);
    return floor % 2 === 0 ? floor + 1 : floor;
}

function escape(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function render(message) {
    const labelText = preferredWidth(LABEL);
    const messageText = preferredWidth(message);
    const labelWidth = labelText + 9;
    const messageWidth = messageText + 9;
    const totalWidth = labelWidth + messageWidth;
    const label = escape(LABEL);
    const text = escape(message);
    const title = `${label}: ${text}`;
    const labelX = labelWidth * 5;
    const messageX = labelWidth * 10 + messageWidth * 5;
    const labelLength = (labelText - 1) * 10;
    const messageLength = (messageText - 1) * 10;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${title}">`
        + `<title>${title}</title>`
        + `<linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>`
        + `<clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath>`
        + `<g clip-path="url(#r)"><rect width="${labelWidth}" height="20" fill="#555"/>`
        + `<rect x="${labelWidth}" width="${messageWidth}" height="20" fill="#1976d2"/>`
        + `<rect width="${totalWidth}" height="20" fill="url(#s)"/></g>`
        + `<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">`
        + `<text aria-hidden="true" x="${labelX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${labelLength}">${label}</text>`
        + `<text x="${labelX}" y="140" transform="scale(.1)" fill="#fff" textLength="${labelLength}">${label}</text>`
        + `<text aria-hidden="true" x="${messageX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${messageLength}">${text}</text>`
        + `<text x="${messageX}" y="140" transform="scale(.1)" fill="#fff" textLength="${messageLength}">${text}</text>`
        + `</g></svg>\n`;
}

const version = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'extension', 'package.json'), 'utf8')).version;
const output = path.join(__dirname, 'upstream.svg');
const svg = render(`DenizenVSCode ${version}`);
if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== svg) {
    fs.writeFileSync(output, svg);
}
