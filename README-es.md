# **Anemona Secret**

[![Registro de cambios](https://img.shields.io/badge/Registro%20de%20cambios-0.0.2-orange)](https://github.com/mygnet/anemona-secrets/blob/main/CHANGELOG-es.md)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)](https://github.com/mygnet/anemona-secrets/blob/main/LICENSE)
[![Leer en ingles](https://img.shields.io/badge/Leer%20en-Ingles-green)](README.md)

Extensión de VS Code que gestiona contraseñas desde el panel de la barra lateral de forma intuitiva y visual.

Esta extension es muy imprescindible para nosotros los desarrolladores, para la administración de contraseñas de las base de datos, hosting ftp, control de versiones, paneles de dns, y otros servicios,  de esta forma tenerlo disponible en nuestro espacio de trabajo. Los documentos utilizados para almacenar contraseñas serán  encriptados con AES 256 bits, con dos niveles de cifrado, el primer nivel es con metadatos único y  propios del Archivo cuando se genera, y el segundo nivel se encripta con una contraseña maestra que no se guarda, solo se usa para bloquear y desbloquear el archivo.

![Issues](/assets/github/anemona-secrets-00.gif)

## **Características**

- Algoritmo de cifrado para resguardar el archivo local en AES 256 bits
- Crear archivos locales para almacenar contraseñas cifradas
- Abrir archivos de contraseñas
- Cifrar/Descifrar archivos de contraseñas
- Listado de archivos recientes de contraseñas
- El administrador de contraseña no hay un limite de registros
- Se pueden Agregar, editar, eliminar, copiar y visualizar las contraseñas y los identificadores relacionados.
- Se pueden ordenar A-Z/Z-A por el identificador titulo de las contraseñas.
- Los identificadores que puedes relacionar a un registro de contraseña son: Nombre de usuario, e-mail, token, host, web, link, teléfono, api, ip, puerto, data base name, Mas información.
- Exportar los password a texto claro y en formato json.  


### **Crear un archivos para administrar contraseñas**

La administración de contraseñas es muy sencilla e intuitiva, como se muestra en la imagen el proceso de agregar un llavero.

![Incidencias](/assets/github/anemona-secrets-01.gif)

### **Opciones en los llaveros de contraseñas**

Básicamente existen algunas opciones genéricas, agregar, editar y ordenar el listado de contraseñas, se puede destacar que pueden bloquear los llaveros con una contraseña maestra.

![Incidencias](/assets/github/anemona-secrets-02.gif)

### **Exportar llaveros**

Como una utilidad es la opción de exportar los llaveros a simples archivos de texto plano y json.

![Incidencias](/assets/github/anemona-secrets-03.gif)

### **Echando un vistazo al archivo**
El archivo de contraseñas se guarda de manera encriptada.

![Incidencias](/assets/github/anemona-secrets-04.gif)


### **Proteger el archivo con contraseña personalizada**
El archivo se puede resguardar con una contraseña privada, de tal manera que no se podrá abrir sin esta contraseña. Es importante no olvidarla ya que no se podrá descifrar el archivo.

![Incidencias](/assets/github/anemona-secrets-05.gif)

### *Control de cambios*

See [CHANGELOG.md](https://github.com/mygnet/anemona-secrets/blob/main/CHANGELOG-es.md)

### *Licencia*

See [LICENSE](https://github.com/mygnet/anemona-secrets/blob/main/LICENCE)