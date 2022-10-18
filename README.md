# **Anemona Task GitLab**
[![Changelog](https://img.shields.io/badge/CHANGELOG-0.1.0-orange)](https://github.com/mygnet/anemona-task/blob/main/CHANGELOG.md)
[![license](https://img.shields.io/badge/LICENSE-MIT-blue)](https://github.com/mygnet/anemona-task/blob/main/LICENSE)
[![readme](https://img.shields.io/badge/README-Spanish-green)](README-es.md)

VS Code extension that manages passwords from the sidebar panel in an intuitive and visual way.

This extension is very essential for us developers, for database password management, ftp hosting, version control, dns panels, and other services, thus having it available in our workspace. The documents used to store passwords will be encrypted with AES 256 bits, with two levels of encryption, the first level is with unique metadata specific to the File when it is generated, and the second level is encrypted with a master password that is not saved, only is used to lock and unlock the file.

![characteristic](/assets/github/anemona-secrets-00.gif)

## **Characteristic**
 
- Encryption algorithm to protect the local file in AES 256 bits
- Create local files to store encrypted passwords
- Open password files
- Encrypt/Decrypt password files
- List of recent password files
- The password manager there is no record limit
- Passwords and related identifiers can be added, edited, deleted, copied and viewed.
- They can be ordered A-Z/Z-A by the title identifier of the passwords.
- The identifiers that you can relate to a password record are: Username, e-mail, token, host, web, link, telephone, api, ip, port, database name, More information.
- Export passwords to clear text and in json format.
 
 
### **Create a file to manage passwords**
 
Password management is very simple and intuitive, as the process of adding a keychain is shown in the image.

![create](/assets/github/anemona-secrets-01.gif)

### **Options in password keychains**

Basically there are some generic options, add, edit and order the list of passwords, it can be noted that they can lock the keychains with a master password.

![password](/assets/github/anemona-secrets-02.gif)

### **Export Keychains**

As a utility is the option to export the keychains to simple plain text and json files.

![utility](/assets/github/anemona-secrets-03.gif)

### **Browsing the file**

The password file is kept encrypted.

![password](/assets/github/anemona-secrets-04.gif)

### **Protect file with custom password**

The file can be protected with a private password, in such a way that it cannot be opened without this password. It is important not to forget it as the file cannot be decrypted.

![protected](/assets/github/anemona-secrets-05.gif)

### *Change control*

See [CHANGELOG.md](https://github.com/mygnet/anemona-task/blob/main/CHANGELOG-es.md)

### *License*

See [LICENSE](https://github.com/mygnet/anemona-task/blob/main/LICENCE)