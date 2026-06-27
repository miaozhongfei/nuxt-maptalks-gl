// 服务端签名路由（演示）。
// defineMaptalksSignHandler 由模块 addServerImportsDir 自动导入，无需手动 import。
// 真实项目应在此调用自有签名服务，密钥仅存于服务端、绝不返回给前端。
export default defineMaptalksSignHandler(() => {
  // 演示用「签名 token」——真实场景应来自加密签名逻辑
  const token = `demo-${Date.now()}`;
  return {
    urlTemplate: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png?token=${token}`,
    options: {
      subdomains: ['b', 'c', 'd'],
      attribution: '© CARTO (signed demo)',
    },
  };
});
