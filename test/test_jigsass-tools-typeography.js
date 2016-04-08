'use strict';

/* global assert, fs, path, Sassaby,  */

describe('jigsass-tools-typography', () => {
  const file = path.resolve(__dirname, 'helpers/importer.scss');
  const sassaby = new Sassaby(file);

  describe('math', () => {
    describe('pow [function]', () => {
      it('Squares a number if no second argument is passed', () => {
        sassaby.func('jigsass-pow').calledWithArgs('2').equals('4');
      });

      it('Calculates exponentiation correctly', () => {
        sassaby.func('jigsass-pow').calledWithArgs('2, 3').equals('8');
      });

      it('Calculates non-integer exponents correctly', () => {
        sassaby.func('jigsass-pow').calledWithArgs('9, 0.5').equals('3.0');
      });

      it('Calculates negative exponents correctly', () => {
        sassaby.func('jigsass-pow').calledWithArgs('10, -1').equals('.1');
      });

      it('Returns 1 if the exponent is 0', () => {
        sassaby.func('jigsass-pow').calledWithArgs('9, 0').equals('1');
      });
    });
  });

  describe('config', () => {
    describe('_jigsass-get-config-bp-value [function]', () => {
      it('Returns the value of an explicitly defined breakpoint', () => {
        sassaby.func('_jigsass-get-config-bp-value')
          .calledWithArgs('default', 'map-get(_jigsass-merge-sizes(), body)')
          .equals('16px');
      });

      it('Returns the value of the previously defined breakpoint ' +
        'for implicitly defined breakpoints', () => {
        sassaby.func('_jigsass-get-config-bp-value')
          .calledWithArgs('large', 'map-get(_jigsass-merge-sizes(), body)')
          .equals('18px');
      });

      it('Returns the value of the first defined breakpoint ' +
        'when an undefined breakpoint is passed', () => {
        sassaby.func('_jigsass-get-config-bp-value')
          .calledWithArgs('bogus', 'map-get(_jigsass-merge-sizes(), body)')
          .equals('16px');
      });

      it('Trows when $source is not a map', () => {
        assert.throws(
          () => {
            sassaby.func('_jigsass-get-config-bp-value')
              .calledWithArgs('default', 'bogus')
          },
          /_jigsass-get-config-bp-value: bogus is a string, not a map/
        );
      });
    });

    describe('jigsass-get-rhythm-unit [function]', () => {
      it('Gets a value from the `rhythm-unit` key of the sizes map', () => {
        sassaby.func('jigsass-get-rhythm-unit')
          .calledWithArgs('')
          .equals('6px');
      });
    });

    describe('jigsass-get-body-font-size [function]', () => {
      it('Gets a value from the `body` key of the sizes map', () => {
        sassaby.func('jigsass-get-body-font-size')
          .calledWithArgs('')
          .equals('16px');
      });
    });

    describe('jigsass-get-size [function]', () => {
      it('Gets a size with no scale in default breakpoint', () => {
        sassaby.func('jigsass-get-size')
          .calledWithArgs('number')
          .equals('2rem');
      });

      it('Gets a size from negative ratio', () => {
        sassaby.func('jigsass-get-size')
          .calledWithArgs('neg')
          .equals('1.83333rem');
      });

      it('Gets a size with scale in default breakpoint', () => {
        sassaby.func('jigsass-get-size')
          .calledWithArgs('scale')
          .equals('2.5rem');
      });

      it('Gets a size with scale and custom ratio in default breakpoint', () => {
        sassaby.func('jigsass-get-size')
          .calledWithArgs('ratio')
          .equals('8rem');
      });

      it('Gets a size in custom breakpoint', () => {
        sassaby.standaloneMixin('jigsass-mq')
          .calledWithBlockAndArgs('.test{width: jigsass-get-size(number)}', 'tiny')
          .equals('.test{}@media(min-width:20em){.test{width:2rem}}');
      });

      it('Gets a size in em in default breakpoint', () => {
        sassaby.func('jigsass-get-size')
          .calledWithArgs('number, $unit: em')
          .equals('.75em');
      });

      it('Gets a size in ems in custom breakpoint', () => {
        sassaby.standaloneMixin('jigsass-mq')
          .calledWithBlockAndArgs('.test{width: jigsass-get-size(number, $unit: em)}', 'tiny')
          .equals('.test{}@media(min-width:20em){.test{width:.77778em}}');
      });

      it('Throws when `$size` does not resolve to a number', () => {
        assert.throws(
          () => {
            sassaby.func('jigsass-get-size')
              .calledWithArgs('bogus')
          },
          /jigsass-get-size: `bogus` is a `string`, not a valid CSS length\./
        );
      });

    });
  });

  describe('units', () => {
    describe('jigsass-convert-length [function]', () => {
      it('Does not convert same units', () => {
        sassaby.func('jigsass-convert-length')
          .calledWithArgs('2em', 'em')
          .equals('2em');
      });

      it('converts px to em', () => {
        sassaby.func('jigsass-convert-length')
          .calledWithArgs('16px', 'em')
          .equals('1em');
      });

      it('converts px to rem', () => {
        sassaby.func('jigsass-convert-length')
          .calledWithArgs('1px', 'rem')
          .equals('.16667rem');
      });

      it('converts px to %', () => {
        sassaby.func('jigsass-convert-length')
          .calledWithArgs('16px', '%', '$to-context: 160px')
          .equals('10%');
      });

      it('converts px to ex', () => {
        sassaby.func('jigsass-convert-length')
          .calledWithArgs('16px', 'ex')
          .equals('2ex');
      });

      it('converts em to %', () => {
        sassaby.func('jigsass-convert-length')
          .calledWithArgs('2em', '%', '$to-context: 160px')
          .equals('20%');
      });

      it('converts em to mm', () => {
        sassaby.func('jigsass-convert-length')
          .calledWithArgs('2em', 'mm', '18px')
          .equals('9.525mm');
      });

      it('converts % to px', () => {
        sassaby.func('jigsass-convert-length')
          .calledWithArgs('200%', 'px', '10px')
          .equals('20px');
      });

      it('converts rem to px', () => {
        sassaby.func('jigsass-convert-length')
          .calledWithArgs('2rem', 'px')
          .equals('12px');
      });

      it('converts rem to em', () => {
        sassaby.func('jigsass-convert-length')
          .calledWithArgs('2rem', 'em', '10px')
          .equals('1.2em');
      });
    });

    describe('jigsass-strip-unit [Function]', () => {
      it('strips px units', () => {
        sassaby.func('jigsass-strip-unit')
          .calledWithArgs('12px')
          .equals('12');
      });

      it('strips em units', () => {
        sassaby.func('jigsass-strip-unit')
          .calledWithArgs('0em')
          .equals('0');
      });

      it('strips rem units', () => {
        sassaby.func('jigsass-strip-unit')
          .calledWithArgs('10rem')
          .equals('10');
      });

      it('strips percentages', () => {
        sassaby.func('jigsass-strip-unit')
          .calledWithArgs('100%')
          .equals('100');
      });

      it('Trows when argument isn\'t a number', () => {
        assert.throws(
          () => {
            sassaby.func('jigsass-strip-unit')
              .calledWithArgs('str')
          },
        /jigsass-strip-unit: `str` is a string. not a number/
      );
      });
    });

    describe('jigsass-rem [mixin]', () => {
      it('Outputs a converted pixel value in rem', () => {
        sassaby.includedMixin('jigsass-rem')
          .calledWithArgs('height', '24px')
          .hasNumDeclarations(1);

        sassaby.includedMixin('jigsass-rem')
          .calledWithArgs('height', '24px')
          .equals('height: 4rem');
      });

      it('Outputs converted pixel values in rem for properties with a list of values', () => {
        sassaby.includedMixin('jigsass-rem')
          .calledWithArgs('padding', '24px 6px')
          .hasNumDeclarations(1);

        sassaby.includedMixin('jigsass-rem')
          .calledWithArgs('padding', '24px 6px')
          .equals('padding: 4rem 1rem');
      });

      it('Outputs pixel fallback', () => {
        sassaby.includedMixin('jigsass-rem')
          .calledWithArgs('height', '24px', '$px-fallback: true')
          .hasNumDeclarations(2);

        sassaby.includedMixin('jigsass-rem')
          .calledWithArgs('height', '24px', '$px-fallback: true')
          .equals('height: 24px;height: 4rem');
      });

      it('doesn\'t break on strings', () => {
        sassaby.includedMixin('jigsass-rem')
          .calledWithArgs('float', 'right')
          .equals('float: right');
      });

      describe('Breakpoints', () => {
        it('Iterates over all bps defined in `$jigsass-base-spacing-unit`', () => {
          sassaby.includedMixin('jigsass-rem')
            .calledWithArgs('height', '24px', 'all')
            .equals('height:4rem}@media(min-width:20em){.test{height:3.42857rem}');
        });
        it('Generates values at given breakpoint', () => {
          sassaby.includedMixin('jigsass-rem')
            .calledWithArgs('height', '24px', 'small')
            .createsMediaQuery('(min-width: 30em)');

          sassaby.includedMixin('jigsass-rem')
            .calledWithArgs('height', '24px', 'small')
            .hasNumDeclarations(1);
        });
      });
    });
  });
  describe('rhythm', () => {
    const sassabyPxFallback = new Sassaby(file, {
      variables: {
        'jigsass-rem-px-fallback': 'true',
      }
    });

    describe('jigsass-lines-for-size [function]', () => {
      it('Calculates the needed number of lines for a named size', () => {
        sassaby.func('jigsass-lines-for-size')
          .calledWithArgs('type-min1')
          .equals('3');
      });

      it('Adds padding when needed', () => {
        sassaby.func('jigsass-lines-for-size')
          .calledWithArgs('body')
          .equals('4');
      });

      it('Calculates the needed number of lines from and explicit length', () => {
        sassaby.func('jigsass-lines-for-size')
          .calledWithArgs('12px')
          .equals('3');
      });
    });

    describe('jigsass-rhythm [function]', () => {
      it('Calculates the correct length of lines', () => {
        sassaby.func('jigsass-rhythm')
          .calledWithArgs('1')
          .equals('1rem');
      });

      it('Outputs lengths in specified units', () => {
        sassaby.func('jigsass-rhythm')
          .calledWithArgs('2, $unit: px')
          .equals('12px');
      });

      it('Outputs lengths based on custom context', () => {
        sassaby.func('jigsass-rhythm')
          .calledWithArgs('1, 12px, em')
          .equals('.5em');
      });
    });

    describe('jigsass-set-baseline [mixin]', () => {
      it('Create the expected breakpoints', () => {
        sassaby.standaloneMixin('jigsass-set-baseline')
          .called()
          .createsMediaQuery('(min-width: 20em)');
      });

      it('Create an html element selector', () => {
        sassaby.standaloneMixin('jigsass-set-baseline')
          .called()
          .createsSelector('html');
      });

      it('Create an body element selector', () => {
        sassaby.standaloneMixin('jigsass-set-baseline')
          .called()
          .createsSelector('body');
      });

      it('Declares the correct properties with correct values in correct breakpoints', () => {
        sassaby.standaloneMixin('jigsass-set-baseline')
          .called()
          .equals('html{font-size:37.5%}@media(min-width:20em){html{font-size:43.75%}}body{font-size:2.66667em;line-height:4rem}@media(min-width:20em){body{font-size:2.57143em}}');
      });

      it('Can correctly create pixel fallback when needed', () => {
        sassabyPxFallback.standaloneMixin('jigsass-set-baseline')
          .called()
          .equals('html{font-size:37.5%}@media(min-width:20em){html{font-size:43.75%}}body{font-size:2.66667em;line-height:28px;line-height:4rem}@media(min-width:20em){body{font-size:2.57143em}}');
      });
    });

    describe('jigsass-font-size [mixin]', () => {
      it('Outputs size based on named-size and automatically calculated lines', () => {
        sassaby.includedMixin('jigsass-font-size')
          .calledWithArgs('type1')
          .declares('font-size', '3rem');

        sassaby.includedMixin('jigsass-font-size')
          .calledWithArgs('type1')
          .declares('line-height', '4rem');
      });

      it('Calculates line-height based on explicitly set number of lines', () => {
        sassaby.includedMixin('jigsass-font-size')
          .calledWithArgs('type1', '$lines: 5')
          .declares('line-height', '5rem');
      });

      it('Iterates over all breakpoints defined for `rhythm-unit` and `$size`',
        () => {
        sassaby.includedMixin('jigsass-font-size')
          .calledWithArgs('type1', 'all')
          .equals('font-size:3rem;line-height:4rem}@media(min-width:20em){.test{font-size:2.85714rem;line-height:4rem}');
      });

      it('Can create the correct pixel fallback', () => {
        sassabyPxFallback.includedMixin('jigsass-font-size')
          .calledWithArgs('type1', 'all')
          .equals('font-size:18px;line-height:24px;font-size:3rem;line-height:4rem}@media(min-width:20em){.test{font-size:20px;line-height:28px;font-size:2.85714rem;line-height:4rem}');
      });

      it('Can generate font-size in ems', () => {
        sassaby.includedMixin('jigsass-font-size')
          .calledWithArgs('type1', 'all', '$unit: em')
          .equals('font-size:1.125em;line-height:4rem}@media(min-width:20em){.test{font-size:1.11111em;line-height:4rem}');
      });
    });

    describe('jigsass-border [mixin]', () => {
      it('Creates a border and padding that doesn\' mess up vertical rhythm', () => {
        sassaby.includedMixin('jigsass-border')
          .calledWithArgs('bottom', '1px')
          .equals('border-bottom:.16667rem solid;padding-bottom:.83333rem');
      });

      it('Creates border and padding for an explicit number of lines', () => {
        sassaby.includedMixin('jigsass-border')
          .calledWithArgs('top', 'border', 2)
          .equals('border-top:.5rem solid;padding-top:1.5rem');
      });

      it('Creates borders around all sides', () => {
        sassaby.includedMixin('jigsass-border')
          .calledWithArgs('all', '1px')
          .equals('border:.16667rem solid;padding:.83333rem');
      });

      it('Creates the correct border and padding at a specified breakpoint', () => {
        sassaby.includedMixin('jigsass-border')
          .calledWithArgs('top', 'border', 2, '$bps: tiny')
          .createsMediaQuery('(min-width: 20em)');

        sassaby.includedMixin('jigsass-border')
          .calledWithArgs('top', 'border', 2, '$bps: tiny')
          .declares('border-top', '.42857rem solid');

        sassaby.includedMixin('jigsass-border')
          .calledWithArgs('top', 'border', 2, '$bps: tiny')
          .declares('padding-top', '1.57143rem');
      });

      it('Can create pixel fallback', () => {
        sassabyPxFallback.includedMixin('jigsass-border')
          .calledWithArgs('top', 'border', 2, '$bps: all')
          .equals('border-top:3px solid;padding-top:9px;border-top:.5rem solid;padding-top:1.5rem}@media(min-width:20em){.test{border-top:3px solid;padding-top:11px;border-top:.42857rem solid;padding-top:1.57143rem}');
      });
    });

    describe('jigsass-border-top [mixin]', () => {
      it('Creates a border and padding that doesn\' mess up vertical rhythm', () => {
        sassaby.includedMixin('jigsass-border-top')
          .calledWithArgs('1px')
          .equals('border-top:.16667rem solid;padding-top:.83333rem');
      });
    });

    describe('jigsass-border-bottom [mixin]', () => {
      it('Creates a border and padding that doesn\' mess up vertical rhythm', () => {
        sassaby.includedMixin('jigsass-border-bottom')
          .calledWithArgs('1px')
          .equals('border-bottom:.16667rem solid;padding-bottom:.83333rem');
      });
    });

    describe('jigsass-border-horizontal [mixin]', () => {
      it('Creates borders and padding that doesn\' mess up vertical rhythm', () => {
        sassaby.includedMixin('jigsass-border-horizontal')
          .calledWithArgs('1px')
          .equals('border-top:.16667rem solid;padding-top:.83333rem;border-bottom:.16667rem solid;padding-bottom:.83333rem');
      });
    });

    describe('jigsass-borders [mixin]', () => {
      it('Creates borders and padding that doesn\' mess up vertical rhythm', () => {
        sassaby.includedMixin('jigsass-borders')
          .calledWithArgs('1px')
          .equals('border:.16667rem solid;padding:.83333rem');
      });
    });
  });
});
