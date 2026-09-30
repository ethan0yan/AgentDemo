# 低空控制平台（前端演示）

无人机数据研判与业务分流智能体前端页面，包含：

- 事件预警
- 数据分流
- 事件研判
- 事件跟踪
- 多维度统计

## 在线访问（推荐）

本项目已配置 **GitHub Pages** 自动部署。推送到 `main` 分支后：

1. 打开仓库 **Settings → Pages**
2. **Source** 选择 **GitHub Actions**
3. 等待 Actions 跑完（约 1～2 分钟）
4. 访问地址一般为：

```text
https://<你的用户名>.github.io/<仓库名>/
```

他人无需安装 Node / npm，浏览器打开上述链接即可使用。

## 本地开发（可选）

- Node.js `24.13.0`
- npm `11.6.2`

```bash
npm install
npm run dev
```

```bash
npm run build    # 生成 dist 静态文件
npm run preview  # 本地预览构建结果
```

当前使用本地 mock 数据，可直接演示筛选、分流确认与统计图表。
