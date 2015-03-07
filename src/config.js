"use strict";

var path = require( "path" ),
    fs = require( "fs" );

exports.defaults = function() {
  return {
    sprite: {
      inDir: "images/sprite",
      outDir: "images",
      commonDir: "common",
      stylesheetOutDir: "stylesheets/sprite",
      options: {
        stylesheet: "stylus"
      }
    }
  };
};

exports.validate = function ( config, validators ) {
  var errors = [];
  if ( validators.ifExistsIsObject( errors, "sprite config", config.sprite ) ) {
    if ( validators.ifExistsIsString( errors, "sprite.inDir", config.sprite.inDir ) ) {
      config.sprite.inDirFull = path.join( config.watch.sourceDir, config.sprite.inDir );

      if ( validators.ifExistsIsString( errors, "sprite.commonDir", config.sprite.commonDir ) ) {
        config.sprite.commonDirFull = path.join( config.sprite.inDirFull, config.sprite.commonDir );

        // If it doesnt exist, nuke it
        if ( !fs.existsSync( config.sprite.commonDirFull ) ) {
          config.sprite.commonDirFull = null;
        }
      }
    }

    if ( validators.ifExistsIsString( errors, "sprite.outDir", config.sprite.outDir ) ) {
      config.sprite.outDirFull = path.join( config.watch.sourceDir, config.sprite.outDir );
    }

    if ( validators.ifExistsIsString( errors, "sprite.stylesheetOutDir", config.sprite.stylesheetOutDir ) ) {
      config.sprite.stylesheetOutDirFull = path.join( config.watch.sourceDir, config.sprite.stylesheetOutDir );
    }

    var o = config.sprite.options;
    if ( ( typeof o === "object" && !Array.isArray( o ) ) || ( typeof o === "function" )) {
      if ( validators.ifExistsIsString( errors, "sprite.options.stylesheet", config.sprite.options.stylesheet ) ) {
        if ( ["stylus", "less", "sass", "scss", "css"].indexOf( config.sprite.options.stylesheet ) === -1 ) {
          errors.push( "sprite.options.stylesheet must be one of: stylus, less, sass, scss, css" );
        }
      }

    } else {
      errors.push( "sprite.options must be an object or a function" );
    }

  }

  return errors;
};
