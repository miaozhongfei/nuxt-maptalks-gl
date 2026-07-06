// 服务端签名路由（演示）。defineMaptalksSignHandler 由模块 addServerImportsDir 自动导入。
export default defineMaptalksSignHandler(() => {
  const token = `demo-${Date.now()}`;
  return {
    urlTemplate: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png?token=${token}`,
    options: { subdomains: ['b', 'c', 'd'], attribution: '© CARTO (signed demo)' },
  };
});
