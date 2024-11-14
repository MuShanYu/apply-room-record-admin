# 使用官方的 Nginx 镜像作为基础镜像
FROM nginx

# 删除 Nginx 默认配置
RUN rm -rf /etc/nginx/conf.d/default.conf

# 将本地的 Nginx 配置文件复制到容器中
COPY ./projects.conf /etc/nginx/conf.d/

# 配置证书
COPY ./ssl/* /etc/nginx/ssl/

# 将构建好的 Vue 项目文件复制到 Nginx 的默认服务目录
COPY ./dist/ /usr/share/nginx/html/



# 暴露 Nginx 使用的端口
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]
