"use strict";

var path = require( 'path' ),
    fs = require( 'fs' );

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

exports.placeholder = function () {
   var ph = "  # sprite:                     #\n" +
      "    # inDir: \"images/sprite\" # Folder inside which are the images to be sprited. Every folder\n" +
      "                                # at the root of this folder will generate a single sprite. This\n" +
      "                                # path is relative to watch.sourceDir, which defaults to 'assets'\n" +
      "    # outDir: \"images\"     # Where to place generated sprites relative to watch.sourceDir\n" +
      "                                # Placing the output images outside the sprite directory makes it\n" +
      "                                # easy to exclude the sprite directory from being copied to \n" +
      "                                # watch.compiledDir.\n" +
      "    # commonDir: \"common\"       # Folder inside which are images to be included in every sprite\n" +
      "                                # This is a string path relative to inDir.\n" +
      "    # stylesheetOutDir: \"stylesheets/sprite\"  # Where to place the output stylesheets. Path is relative\n" +
      "                                # to watch.sourceDir\n" +
      "    # options:                  # Pass through options for node-sprite-generator, the tool this\n" +
      "      # stylesheet: \"stylus\"    # module uses under the hood to do the heavy lifting. Details on\n" +
      "                                # the available options can be found here:\n" +
      "                                # https://github.com/selaux/node-sprite-generator#options\n" +
      "                                # mimosa-sprite provides the values for 'src', 'spritePath'\n" +
      "                                # and 'stylesheetPath' based on the inDir folders structure.\n" +
      "                                # Other config options can be placed in this 'options' object.\n" +
      "                                # For more control, 'options' can be a function that takes the\n" +
      "                                # inferred config generated by mimosa-sprite. If you are\n" +
      "                                # generating 10 sprites, the options function will be called\n" +
      "                                # 10 times for each sprite, giving you the chance to make\n" +
      "                                # specific modifications to the node-sprite-generator config.\n\n";
  return ph;
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