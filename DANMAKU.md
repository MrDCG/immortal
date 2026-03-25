# 弹幕功能说明

## 功能概述

云上香项目新增了弹幕功能，用户可以在页面上发送弹幕，所有访问的用户都能看到其他用户发送的弹幕。

## 功能特性

### 1. 发送弹幕
- 在页面底部输入框输入文字
- 点击"发送"按钮或按回车键发送
- 弹幕最长 200 个字符
- 实时同步给所有在线用户

### 2. 弹幕设置
点击弹幕输入框旁的设置按钮（⚙️）可打开弹幕设置面板，支持以下配置：

- **启用弹幕**：开关弹幕功能
- **弹幕透明度**：调整弹幕透明度（10%-100%）
- **字体大小**：调整弹幕字体大小（0.5x-2x）
- **弹幕速度**：调整弹幕滚动速度（0.5x-2x）
- **屏幕占比**：调整弹幕显示区域高度（20%-100%）
- **同屏数量**：设置同屏最大弹幕数量（10-100条）
- **弹幕颜色**：
  - 随机颜色：多彩弹幕
  - 白色：纯白色弹幕
  - 自定义：选择自己喜欢的颜色
- **清空弹幕**：一键清空屏幕上的所有弹幕

## 技术实现

### 前端实现
- **自定义弹幕组件**：使用 Vue 3 + requestAnimationFrame 实现平滑动画
- **Socket.IO Client**：实现 WebSocket 实时通信
- **Pinia**：状态管理，持久化配置到 localStorage

### 后端实现
- **Node.js + Express**：HTTP 服务器
- **Socket.IO**：WebSocket 实时推送服务
- **PostgreSQL**：弹幕数据存储
- **Docker**：容器化部署

### 文件结构
```
immortal/
├── src/
│   ├── stores/
│   │   └── danmaku.ts          # 弹幕状态管理
│   └── components/
│       ├── SimpleDanmaku.vue    # 弹幕显示容器
│       ├── DanmakuInput.vue     # 弹幕输入
│       └── DanmakuSettings.vue  # 弹幕设置面板

immortal-danmaku-server/
├── server.js                    # WebSocket 服务器
├── package.json
├── Dockerfile
└── docker-compose.yml
```

### 配置说明
弹幕配置会自动保存到浏览器的 localStorage 中，下次访问时会自动加载。

### 数据库结构
```sql
CREATE TABLE danmaku (
  id SERIAL PRIMARY KEY,
  text VARCHAR(200) NOT NULL,
  color VARCHAR(7) DEFAULT '#FFFFFF',
  font_size INTEGER DEFAULT 24,
  speed INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API 接口

#### 获取历史弹幕
```
GET /api/danmaku?limit=50
```

#### WebSocket 事件
- `connect`：连接成功
- `connected`：服务器确认连接
- `new_danmaku`：接收新弹幕
- `send_danmaku`：发送弹幕
- `error`：错误信息
- `disconnect`：断开连接

#### 健康检查
```
GET /health
```

## 使用示例

1. 访问云上香网站
2. 等待 WebSocket 连接成功（控制台会显示连接成功消息）
3. 自动加载最近 50 条历史弹幕
4. 在底部输入框输入祝福语，如"祈求家人平安"
5. 点击发送或按回车键
6. 弹幕会从右侧滑入屏幕
7. 所有在线用户都能看到您发送的弹幕
8. 点击设置按钮可调整弹幕效果

## 部署说明

### 后端部署
```bash
cd immortal-danmaku-server
docker-compose up -d
```

服务地址：`http://156.238.254.48:3002`

### 前端部署
```bash
cd immortal
npm install
npm run build
bash deploy.sh
```

访问地址：`http://156.238.254.48:3001`

## 注意事项
- 弹幕功能默认启用，可在设置中关闭
- 弹幕内容遵循文明上网规范
- 请勿发送违规、攻击性内容
- WebSocket 断开后会自动重连
- 历史弹幕默认加载最近 50 条
