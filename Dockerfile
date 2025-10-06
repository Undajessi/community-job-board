FROM php:8.1-apache
RUN apt-get update && apt-get install -y libzip-dev zip unzip && rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install pdo pdo_sqlite
COPY . /var/www/html/
RUN chown -R www-data:www-data /var/www/html
# Set Apache document root to /var/www/html/public
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!/var/www/html/public!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
EXPOSE 80
