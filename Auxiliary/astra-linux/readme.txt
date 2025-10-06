/usr/sbin/nginx	исполняемый файл							
/usr/local/nginx -	архив, кучка каких-то папок - распаковывать: tar -xzvf /путь/к/файлу/nginx-conf.tar.gz -C /			
																	внутри архива полный путь поэтому в команде просто /			

/etc/nginx -	архив, конфигурация со 117го, включая ключи - распаковывать

создать пустую папку /var/log/nginx								

/etc/systemd/system/nginx.service			файл службы					
systemctl daemon-reload 								
sudo systemctl enable nginx								