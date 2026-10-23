<div align="center">

# MINEZ DenizenVSCode

面向 MINEZ 服务器维护的 [Denizen VS Code 扩展](https://github.com/DenizenScript/DenizenVSCode) Fork。

<a href="../README.md">English</a> ｜
<a href="README_zh-CN.md">简体中文</a>

<br>

<div>
<a href="https://github.com/DenizenScript/DenizenVSCode"><img src="badges/upstream.svg" alt="upstream"></a>
<a href="../LICENSE.txt"><img src="https://img.shields.io/badge/license-MIT-9e9e9e" alt="license"></a>
</div>

<br>

<a href="https://denizen-meta.minez.cc/">查阅文档</a> ｜
<a href="https://github.com/MINEZ/DenizenVSCode/issues">问题反馈</a> ｜
<a href="https://github.com/MINEZ/DenizenVSCode/releases">版本发布</a> ｜
<a href="#相对上游的改动">改动一览</a>

</div>

> [!IMPORTANT]
> **本项目是非官方 Fork，与 DenizenScript 团队没有关系，既未经其认可，也不由其提供支持。**
>
> 与本 Fork 有关的一切，请提交至[本仓库的 issue](https://github.com/MINEZ/DenizenVSCode/issues)，不要带到上游仓库、官方 Discord 或论坛。
>
> 区分方法是先用扩展商店中的官方扩展复现：
>
> - **脱离本 Fork 仍会出现** —— 属于上游的问题，照常向上游反馈，不必也不要提及本 Fork。
> - **脱离本 Fork 便不再出现** —— 属于我们的问题，只应提交到这里。

## 关于

本仓库跟随上游 `master` 分支，为面向 [MINEZ/Denizen](https://github.com/MINEZ/Denizen) 编写的 `.dsc` 文件提供语言支持：语法着色、错误检查、自动补全与悬停文档，所依据的均是该 Fork 而非官方的 meta。除下文列出的内容外，其余部分与上游完全一致。

我们的提交以变基方式跟随上游，历史保持线性：

```bash
git fetch upstream
git rebase upstream/master
```

变基会重写提交哈希，因此同步后推送需要 `git push origin master --force-with-lease`。

## 安装

本扩展不在扩展商店上架。请从[版本发布](https://github.com/MINEZ/DenizenVSCode/releases)页面下载 `.vsix` 文件，然后在“扩展”视图的 `…` 菜单中选择“从 VSIX 安装…”，或者运行：

```bash
code --install-extension denizenscript-minez-<版本号>.vsix
```

安装更新的 `.vsix` 会直接替换旧版。

本扩展可以与官方扩展同时安装，但两者处理的是同一批文件，每条告警与悬停条目都会出现两次。请停用官方扩展，至少在使用本扩展的工作区中停用。两者读取的是同一套 `denizenscript.*` 设置，无须重新配置。

如需自动缩进，可在 `.vscode/settings.json` 中加入：

```json
{
    "[denizenscript]": {
        "editor.autoIndent": "full",
    }
}
```

## 相对上游的改动

| 名称 | 类型 | 改动 |
| --- | --- | --- |
| 扩展标识 | 打包 | 变更 |
| meta 源 | 行为 | 变更 |
| `dialog` 脚本容器 | 检查与着色 | 新增 |
| Meta Docs 链接 | 行为 | 变更 |

**扩展标识。** VS Code 以发布者与名称来识别扩展。若两者都沿用上游，VS Code 会把本地构建当成官方扩展，扩展商店的下一次更新便会将其静默替换，下列改动随之全部失效。现将名称改为 `denizenscript-minez`，扩展标识即 `denizenscript.denizenscript-minez`，显示名为“DenizenScript (MINEZ)”。语言 ID 与 `denizenscript.*` 设置项的命名空间均未改动。

**meta 源。** 语言服务器改以 [MINEZ/SharpDenizenTools](https://github.com/MINEZ/SharpDenizenTools) 而非上游的同名库构建，检查、补全与悬停文档因而依据 MINEZ/Denizen、MINEZ/DenizenCore 与 MINEZ/Depenizen 的 meta，外加 [CraftEngine](https://github.com/Xiao-MoMi/craft-engine) 自带的 Denizen 集成。仅存在于本 Fork 或 CraftEngine 中的命令、标签与事件都能被识别，不再报为不存在。检查方面的完整改动见该仓库。

**`dialog` 脚本容器。** `type: dialog` 的脚本会照常接受检查，不再被报为未知的脚本类型。`dialogs` 段下所列的脚本名也不再被当作 Denizen 命令着色。

**Meta Docs 链接。** 悬停与补全提示中的“Meta Docs”链接改指 [denizen-meta.minez.cc](https://denizen-meta.minez.cc/)，该站点与扩展所用的 meta 出自同一处。此前链接指向官方站点，凡是本 Fork 特有的条目，点开一律是 404。

## 构建

需要 [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) 与 [Node.js](https://nodejs.org/)。语言服务器要从 SharpDenizenTools 子模块构建，因此克隆时需带上子模块：

```bash
git clone --recursive https://github.com/MINEZ/DenizenVSCode
```

1. 在 `DenizenLangServer/` 下运行 `dotnet build --configuration Release`，构建语言服务器。
2. 将 `DenizenLangServer/bin/Release/net8.0/` 中的全部文件复制到 `extension/server/`。
3. 在 `extension/` 下运行 `npm install`，再运行 `npm install -g typescript @vscode/vsce`。
4. 在 `extension/` 下运行 `vsce package`。该命令会先编译 TypeScript 源码，再在同一目录下生成 `denizenscript-minez-<版本号>.vsix`。

如需调试，可在 VS Code 中打开本仓库并按 F5（最好先打开 `extension.ts`）。

打包时还会按 `extension/package.json` 中的版本号重新生成本页顶部的 upstream 徽章，无须手动维护。上游提升版本号后，请将重新生成的 `docs/badges/upstream.svg` 随同步一并提交。

## 版本号

`extension/package.json` 中的版本号沿用上游，不作改动，`.vsix` 文件因此带的也是上游版本号。Fork 的修订信息记录在 Release 的 Tag 中：`v1.5.1.1` 即基于上游 1.5.1 的第一个 Fork 版本。VS Code 要求版本号恰为三段，Fork 修订号因而无法写进 `package.json`。

## 相关仓库

| 仓库 | 用途 |
| --- | --- |
| [MINEZ/Denizen](https://github.com/MINEZ/Denizen) | 脚本引擎，本扩展依据其 meta |
| [MINEZ/SharpDenizenTools](https://github.com/MINEZ/SharpDenizenTools) | 语言服务器背后的 meta 解析与脚本检查库 |
| [MINEZ/DenizenMetaWebsite](https://github.com/MINEZ/DenizenMetaWebsite) | 悬停链接所指的文档站，部署于 [denizen-meta.minez.cc](https://denizen-meta.minez.cc/) |

## 上游

Denizen VS Code 扩展由 [DenizenScript 团队](https://denizenscript.com/)开发，发布于[扩展商店](https://marketplace.visualstudio.com/items?itemName=DenizenScript.denizenscript)。学习这门语言本身，仍应前往[新手指南](https://guide.denizenscript.com/)与官方 [Discord](https://discord.gg/Q6pZGSR)——但仅限于上游原本提供的内容，不包括本 Fork 的任何改动。

此处的改动为单一服务器的需求而作，独立维护。请勿将相关讨论带入上游的各个渠道。

## 许可证

Denizen VS Code 扩展以 MIT 许可证开源，版权归 The Denizen Scripting Team 所有。本 Fork 的修改同样适用该许可证。完整条款见 [LICENSE.txt](../LICENSE.txt)。

简而言之：你几乎可以做任何事，但不得就你使用本软件所造成的后果追究任何开发者的责任。
