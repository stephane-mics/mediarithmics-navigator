Mediarithmics Navigator
=======================

This is the repository for [navigator](https://navigator.mediarithmics.com/), the application used by our customers.

Prerequisites
-------------

### Overview
System:
* node.js, npm
* ruby

Node packages:
* grunt-cli (-g)
* bower (-g)

Ruby gems:
* compass


### Details

Here is the configuration of our build machine (so you can reproduce the build on your side) :

#### To install global packages / gems in your home :

In `~/.npmrc` :
```
prefix=~/.local
```

In `~/.gemrc` :
```
gemhome: /home/your_user/.gem
gem: --no-ri --no-rdoc
```

#### install system dependencies

Here on Debian :

```
sudo aptitude install ruby1.9.3 build-essential libpng-dev zlib1g-dev imagemagick
```

#### update path

Before the build or in your bashrc :
```
export PATH=$PATH:~/.gem/bin:~/.local/bin
export GEM_PATH=$(gem environment gempath)
export GEM_HOME=~/.gem
```

#### install project dependencies

```
npm install -g bower
npm install -g grunt-cli
gem install compass
```

#### optional : set the version of nodejs

We use [nvm](https://github.com/creationix/nvm) to set the nodejs version.

Getting started
---------------

* Clone the navigator project
* Make sure all prerequisites are fulfilled
* `npm install`
* `bower install`
* `grunt` or `grunt serve`

