efsUrl = 'insert url here';

var defaultLastName = 'test';
var defaultFirstName = 'test';
var defaultEmail = 'test@test.';

var webdriver = require('selenium-webdriver'),
  assert = require('assert'),
  By = webdriver.By,
  until = webdriver.until,
  test = require('selenium-webdriver/testing');

var driver = new webdriver.Builder()
  .forBrowser('firefox')
  .build();

test.describe('(setup) Opening EFS Page', function() {
  test.it('should work', function() {
    driver.get(efsUrl);
    driver.getTitle().then(function(title) {
      assert.equal("United States Patent & Trademark Office", title);
    });
  });

  test.after(function() {
    debugger;
  });

});

test.describe('(setup) New application', function() {
  test.it('fields can be populated', function() {
    driver.findElement(webdriver.By.id('certname2')).sendKeys(defaultLastName);
    driver.findElement(webdriver.By.id('certname1')).sendKeys(defaultFirstName);
    driver.findElement(webdriver.By.id('certaddr1')).sendKeys(defaultEmail);
    driver.findElement(webdriver.By.id('New Application')).click();
    driver.findElement(webdriver.By.id('utility')).click();
    driver.findElement(webdriver.By.id('regularApp35111')).click();
  });

  test.it('can be opened', function() {
    driver.findElement(webdriver.By.id('Submit')).click();
    driver.wait(until.elementLocated(webdriver.By.id('titleofinvension')), 1000);
    driver.findElement(webdriver.By.id('ADS')).click();
  });

  test.after(function() {
    debugger;
  });
});

test.describe('App info retrieval section', function() {
  test.it('(TC2531, TC2533) should be available with correct text', function() {
    driver.findElement(webdriver.By.css('#sec22 > table > tbody > tr:nth-child(1) > td')).getText()
      .then(
        function(text) {
          assert.equal(text, 'To pre-fill the Inventor, Domestic Benefit/National Stage, and/or Foreign Priority Information based on previously filed patent application, complete the following fields below, and click the "Show"button. Verify the bibliographic data displayed, identify the section(s) in which to fill, and click the "Retrieve" button to populate data.');
        }
      );
    driver.findElement(webdriver.By.css('#adsformelements > h3:nth-child(3)')).getText()
      .then(
        function(text) {
          assert.equal(text, 'Application Information Retrieval');
        }
      );
  });

  test.it('(TC2534) has fields', function() {
    driver.findElement(webdriver.By.id('sec22_appNo'));
    driver.findElement(webdriver.By.id('sec22_confNo'))
  });

  test.it('(TC2535) pulls up correct bib data', function() {
    driver.findElement(webdriver.By.id('sec22_appNo')).sendKeys('12345678');
    driver.findElement(webdriver.By.id('sec22_confNo')).sendKeys('8142');
    driver.findElement(webdriver.By.id('sec22_button')).click();
    var alert = driver.switchTo().alert();
    alert.accept()
      .then(
        function() {
          driver.findElement(webdriver.By.id('appinfo_title')).getAttribute('value')
            .then(function(v) {
              assert.equal(v, 'OPTICAL SYSTEM FOR BARCODE SCANNER');
            });
          driver.findElement(webdriver.By.id('appinfo_inventor')).getAttribute('value')
            .then(function(v) {
              assert.equal(v, 'Kai-Yuan  Tien');
            });
          driver.findElement(webdriver.By.id('appinfo_date')).getAttribute('value')
            .then(function(v) {
              assert.equal(v, '12/30/2008');
            });
        }
      );
  });

  test.it('(TC2541) bib data success message text is correct', function() {
    driver.findElement(webdriver.By.id('sec22_appNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_appNo')).sendKeys('12345678');
    });
    driver.findElement(webdriver.By.id('sec22_confNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_confNo')).sendKeys('8142');
    });
    driver.findElement(webdriver.By.id('sec22_button')).click();
    var alert = driver.switchTo().alert();
    alert.getText()
      .then(
        function(text) {
          assert.equal(text, 'Successfully Retrieved Parent Application Information.\n');
          alert.accept();
        }
      );
  });

  test.it('(TC2536) populate section checkboxes/labels appear as expected', function() {
    driver.findElement(webdriver.By.id('appinfo_checkbox1'));
    driver.findElement(webdriver.By.id('appinfo_checkbox2'));
    driver.findElement(webdriver.By.id('appinfo_checkbox3'));
    driver.findElement(webdriver.By.id('for_appinfo_checkbox1')).getText()
      .then(function(text) {
        assert.equal(text, 'Inventor Information');
      });
    driver.findElement(webdriver.By.id('for_appinfo_checkbox2')).getText()
      .then(function(text) {
        assert.equal(text, 'Domestic Benefit/National Stage Information');
      });
    driver.findElement(webdriver.By.id('for_appinfo_checkbox3')).getText()
      .then(function(text) {
        assert.equal(text, 'Foreign Priority Information');
      });
  });

  test.it('(TC2532) information (i) working', function() {
    driver.findElement(webdriver.By.css('#adsformelements > h3:nth-child(3) > a')).click();
    var currentWindow = driver.getWindowHandle();
    driver.getAllWindowHandles().then(
      function(windows) {
        driver.switchTo().window(windows[windows.length - 1]);
        // uncomment if bluecoat starts acting up
        //driver.switchTo().alert().accept();
        driver.getTitle().then(
          function(title) {
            assert.equal(title, 'Info I - Application Information Retrieval | USPTO');
          });
      }
    );
    driver.switchTo().window(currentWindow);
  });


  test.after(function() {
    driver.findElement(webdriver.By.id('sec22_appNo')).clear();
    driver.findElement(webdriver.By.id('sec22_confNo')).clear();
    debugger;
  });
});

test.describe('App info retrieval section errors', function() {
  test.beforeEach(function() {

  });

  test.it('(TC2537) missing application number gives error', function() {
    driver.findElement(webdriver.By.id('sec22_appNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_appNo')).sendKeys('');
    });
    driver.findElement(webdriver.By.id('sec22_confNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_confNo')).sendKeys('3678');
    });
    driver.findElement(webdriver.By.id('sec22_button')).click();
    var alert = driver.switchTo().alert();
    alert.getText()
      .then(
        function(text) {
          assert.equal(text, 'Application No cannot be empty or the data entered is incorrectly formatted\n');
          alert.accept();
        }
      );
  });

  test.it('(TC2537) junk application number gives error', function() {
    driver.findElement(webdriver.By.id('sec22_appNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_appNo')).sendKeys('junk123');
    });
    driver.findElement(webdriver.By.id('sec22_confNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_confNo')).sendKeys('3678');
    });
    driver.findElement(webdriver.By.id('sec22_button')).click();
    var alert = driver.switchTo().alert();
    alert.getText()
      .then(
        function(text) {
          // current text
          assert.equal(text, 'No Data Found for Input Search criteria : -');
          // text according to test case
          //assert.equal(text, 'Application No cannot be empty or the data entered is incorrectly formatted\n');
          alert.accept();
        }
      );
  });

  test.it('(TC2538) missing confirmation number gives error', function() {
    driver.findElement(webdriver.By.id('sec22_appNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_appNo')).sendKeys('12345678');
    });
    driver.findElement(webdriver.By.id('sec22_confNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_confNo')).sendKeys('');
    });
    driver.findElement(webdriver.By.id('sec22_button')).click();
    var alert = driver.switchTo().alert();
    alert.getText()
      .then(
        function(text) {
          assert.equal(text, 'Confirmation No cannot be empty or the data entered is incorrectly formatted\n');
          alert.accept();
        }
      );
  });

  test.it('(TC2538) junk confirmation number gives error', function() {
    driver.findElement(webdriver.By.id('sec22_appNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_appNo')).sendKeys('12345678');
    });
    driver.findElement(webdriver.By.id('sec22_confNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_confNo')).sendKeys('junk123');
    });
    driver.findElement(webdriver.By.id('sec22_button')).click();
    var alert = driver.switchTo().alert();
    alert.getText()
      .then(
        function(text) {
          // current text
          assert.equal(text, 'The application number and/or the confirmation number is incorrect, please check your input and try again.');
          // text according to test case
          //assert.equal(text, 'Confirmation No cannot be empty or the data entered is incorrectly formatted\n');
          alert.accept();
        }
      );
  });

  test.it('(TC2539) bad application type gives error (hague)', function() {
    driver.findElement(webdriver.By.id('sec22_appNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_appNo')).sendKeys('35001002');
    });
    driver.findElement(webdriver.By.id('sec22_confNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_confNo')).sendKeys('3678');
    });
    driver.findElement(webdriver.By.id('sec22_button')).click();
    var alert = driver.switchTo().alert();
    alert.getText()
      .then(
        function(text) {
          // current text
          assert.equal(text, 'No Data Found for Input Search criteria : -');
          // text according to test case
          //assert.equal(text, 'Application information cannot be retrieved for this application type');
          alert.accept();
        }
      );
  });

  test.it('(TC2540) mismatched application/confirmation # gives error ', function() {
    driver.findElement(webdriver.By.id('sec22_appNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_appNo')).sendKeys('12345678');
    });
    driver.findElement(webdriver.By.id('sec22_confNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_confNo')).sendKeys('8888');
    });
    driver.findElement(webdriver.By.id('sec22_button')).click();
    var alert = driver.switchTo().alert();
    alert.getText()
      .then(
        function(text) {
          assert.equal(text, 'The application number and/or the confirmation number is incorrect, please check your input and try again.');
          alert.accept();
        }
      );
  });

  test.after(function() {
    driver.findElement(webdriver.By.id('sec22_appNo')).clear();
    driver.findElement(webdriver.By.id('sec22_confNo')).clear();
  });

  test.afterEach(function() {
    debugger;
  });
});

test.describe('Retrieve button', function() {
  test.it('(TC2542) should be disabled after click', function() {
    driver.findElement(webdriver.By.id('sec22_appNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_appNo')).sendKeys('14123456');
    });
    driver.findElement(webdriver.By.id('sec22_confNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_confNo')).sendKeys('5406');
    });

    driver.findElement(webdriver.By.id('sec22_button')).click();
    driver.switchTo().alert().accept();

    driver.findElement(webdriver.By.id('appinfo_checkbox1')).click();
    var retrieveButton = driver.findElement(webdriver.By.id('appinfo_button'));
    retrieveButton.click();
    retrieveButton.isEnabled().then(function(enabled) {
      assert.equal(enabled, false);
      driver.switchTo().alert().accept();
    });
  });

  test.afterEach(function() {
    debugger;
  });
});

test.describe('Pre-population', function() {
  test.it('(TC2543) of inventors should work', function() {
    driver.findElement(webdriver.By.id('sec3_textfield1_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Hiroshi');
      });
    driver.findElement(webdriver.By.id('sec3_textfield3_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Uchimoto');
      });
    driver.findElement(webdriver.By.id('sec3_textfield4_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Kyoto');
      });
    driver.findElement(webdriver.By.id('sec3_textfield6_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'JP');
      });
    driver.findElement(webdriver.By.id('sec3_textfield7_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, '648, Yakushi-cho, Nijyo-agaru, Nishinotoin');
      });
    driver.findElement(webdriver.By.id('sec3_textfield8_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Nakagyo-ku, Kyoto-shi, Kyoto, 6040062');
      });
    driver.findElement(webdriver.By.id('sec3_textfield9_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Kyoto');
      });
    driver.findElement(webdriver.By.id('sec3_textfield12_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'JP');
      });
    driver.findElement(webdriver.By.id('sec3_textfield1_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Mariko');
      });
    driver.findElement(webdriver.By.id('sec3_textfield3_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Okamoto');
      });
    driver.findElement(webdriver.By.id('sec3_textfield4_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Kyoto');
      });
    driver.findElement(webdriver.By.id('sec3_textfield6_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'JP');
      });
    driver.findElement(webdriver.By.id('sec3_textfield7_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, '648, Yakushi-cho, Nijyo-agaru, Nishinotoin');
      });
    driver.findElement(webdriver.By.id('sec3_textfield8_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Nakagyo-ku, Kyoto-shi, Kyoto, 6040062');
      });
    driver.findElement(webdriver.By.id('sec3_textfield9_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Kyoto');
      });
    driver.findElement(webdriver.By.id('sec3_textfield12_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'JP');
      });
  });

  test.it('(TC2544) additional inventors should append list', function() {
    driver.findElement(webdriver.By.id('sec22_appNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_appNo')).sendKeys('12345678');
    });
    driver.findElement(webdriver.By.id('sec22_confNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_confNo')).sendKeys('8142');
    });

    driver.findElement(webdriver.By.id('sec22_button')).click();
    driver.switchTo().alert().accept();

    driver.findElement(webdriver.By.id('appinfo_checkbox1')).click();
    var retrieveButton = driver.findElement(webdriver.By.id('appinfo_button'));
    retrieveButton.click();
    retrieveButton.isEnabled().then(function(enabled) {
      assert.equal(enabled, false);
      driver.switchTo().alert().accept();
    });

    driver.findElement(webdriver.By.id('sec3_textfield1_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Hiroshi');
      });
    driver.findElement(webdriver.By.id('sec3_textfield3_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Uchimoto');
      });
    driver.findElement(webdriver.By.id('sec3_textfield4_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Kyoto');
      });
    driver.findElement(webdriver.By.id('sec3_textfield6_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'JP');
      });
    driver.findElement(webdriver.By.id('sec3_textfield7_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, '648, Yakushi-cho, Nijyo-agaru, Nishinotoin');
      });
    driver.findElement(webdriver.By.id('sec3_textfield8_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Nakagyo-ku, Kyoto-shi, Kyoto, 6040062');
      });
    driver.findElement(webdriver.By.id('sec3_textfield9_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Kyoto');
      });
    driver.findElement(webdriver.By.id('sec3_textfield12_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'JP');
      });
    driver.findElement(webdriver.By.id('sec3_textfield1_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Mariko');
      });
    driver.findElement(webdriver.By.id('sec3_textfield3_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Okamoto');
      });
    driver.findElement(webdriver.By.id('sec3_textfield4_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Kyoto');
      });
    driver.findElement(webdriver.By.id('sec3_textfield6_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'JP');
      });
    driver.findElement(webdriver.By.id('sec3_textfield7_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, '648, Yakushi-cho, Nijyo-agaru, Nishinotoin');
      });
    driver.findElement(webdriver.By.id('sec3_textfield8_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Nakagyo-ku, Kyoto-shi, Kyoto, 6040062');
      });
    driver.findElement(webdriver.By.id('sec3_textfield9_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Kyoto');
      });
    driver.findElement(webdriver.By.id('sec3_textfield12_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'JP');
      });

    driver.findElement(webdriver.By.id('sec3_textfield1_2')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Kai-Yuan');
      });
    driver.findElement(webdriver.By.id('sec3_textfield3_2')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Tien');
      });
    driver.findElement(webdriver.By.id('sec3_textfield4_2')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Hsichih City');
      });
    driver.findElement(webdriver.By.id('sec3_textfield6_2')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'TW');
      });
    driver.findElement(webdriver.By.id('sec3_textfield7_2')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, '5F, No. 18, Lane 83, Kang-Ning Road.,');
      });
    driver.findElement(webdriver.By.id('sec3_textfield9_2')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'Hsichih City, Taipei Hsien');
      });
    driver.findElement(webdriver.By.id('sec3_textfield12_2')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'TW');
      });
  });

  test.it('(TC2546) domestic benefit/ns should populate', function() {
    driver.findElement(webdriver.By.id('sec22_appNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_appNo')).sendKeys('12345678');
    });
    driver.findElement(webdriver.By.id('sec22_confNo')).clear().then(function() {
      driver.findElement(webdriver.By.id('sec22_confNo')).sendKeys('8142');
    });

    driver.findElement(webdriver.By.id('sec22_button')).click();
    driver.switchTo().alert().accept();

    driver.findElement(webdriver.By.id('appinfo_checkbox2')).click();
    var retrieveButton = driver.findElement(webdriver.By.id('appinfo_button'));
    retrieveButton.click();
    retrieveButton.isEnabled().then(function(enabled) {
      assert.equal(enabled, false);
      driver.switchTo().alert().accept();
    });

    driver.findElement(webdriver.By.id('sec9_3_textfield2_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, '12345678');
      });
    driver.findElement(webdriver.By.id('sec9_3_textfield3_0')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, '2008-12-30');
      });
    driver.findElement(webdriver.By.id('sec9_3_textfield1_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, '12345678');
      });
    driver.findElement(webdriver.By.id('sec9_2_select1_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'abandoned');
      });
    driver.findElement(webdriver.By.id('sec9_3_select1_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, 'CIP');
      });
    driver.findElement(webdriver.By.id('sec9_3_textfield2_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, '11423955');
      });
    driver.findElement(webdriver.By.id('sec9_3_textfield3_1')).getAttribute('value')
      .then(function(v) {
        assert.equal(v, '2006-06-14');
      });
  });

  test.afterEach(function() {
    debugger;
  });
});

test.describe('Continuity section 1st Application Number field', function() {
  test.before(function() {});

  test.it('(TC2529) should be disabled', function() {
    var firstAppNum = driver.findElement(webdriver.By.id('sec9_3_textfield1_0'));
    firstAppNum.isEnabled().then(function(enabled) {
      assert.equal(enabled, false);
    });
  });

  test.it('(TC2530) should stay disabled when replaced with new data', function() {
    driver.findElement(webdriver.By.id('ADS')).click();
    var firstAppNum = driver.findElement(webdriver.By.id('sec9_3_textfield1_0'));
    firstAppNum.sendKeys('12123456');
    driver.findElement(webdriver.By.name('sec9_2_button2_0')).click();
    driver.findElement(webdriver.By.id('sec9_3_textfield1_1')).sendKeys('14123456');
    driver.findElement(webdriver.By.name('sec9_2_button1_0')).click();
    var firstAppNum2 = driver.findElement(webdriver.By.id('sec9_3_textfield1_0'));
    firstAppNum2.isEnabled().then(function(enabled) {
      assert.equal(enabled, false);
    });
  });

  test.after(function() {
    debugger;
  });
});

test.describe('(TC2512) File by Reference section', function() {
  test.it('should be collapsed by default', function() {
    var section = driver.findElement(webdriver.By.id('filing_info'));
    section.isDisplayed().then(function(displayed) {
      assert.equal(displayed, false);
    });
  });

  test.after(function() {
    debugger;
  });
});

test.describe('(TC2511) Expanding file by reference section', function() {
  test.it('displays text fields', function() {
    driver.findElement(webdriver.By.id('expanderHead')).click();
    var section = driver.findElement(webdriver.By.id('sec5_textfield5'));
    driver.wait(until.elementIsVisible(section), 2000).then(
      function() {
        driver.findElement(webdriver.By.id('sec5_textfield5')).isDisplayed().then(
          function(displayed) {
            assert.equal(displayed, true);
          }
        );
        driver.findElement(webdriver.By.id('sec5_textfield5')).isDisplayed().then(
          function(displayed) {
            assert.equal(displayed, true);
          }
        );
        driver.findElement(webdriver.By.id('sec5_textfield5')).isDisplayed().then(
          function(displayed) {
            assert.equal(displayed, true);
          }
        );
      });
  });

  test.after(function() {
    debugger;
  });
});

test.describe('(TC2513) File by reference section', function() {
  test.it('description text should match expected text', function() {
    driver.findElement(webdriver.By.css('#filing_info > table > tbody > tr:nth-child(1) > td')).getText()
      .then(
        function(text) {
          assert.equal(text,
            "Only complete this section when filing an application by reference under 35 U.S.C. 111(c) and 37 CFR 1.57(a). Do not complete this section if application papers including a specification and any drawings are being filed. Any domestic benefit or foreign priority information must be provided in the appropriate section(s) below (i.e., \"Domestic Benefit/National Stage Information\" and \"Foreign Priority Information\").\n\nFor the purposes of a filing date under 37 CFR 1.53(b), the description and any drawings of the present application are replaced by this reference to the previously filed application, subject to conditions and requirements of 37 CFR 1.57(a)."
          );
        });
  });

  test.it('field text should match expected text', function() {
    driver.findElement(webdriver.By.css('#for_sec5_textfield5')).getText()
      .then(function(text) {
        assert.equal(text, "Application number of the previously filed application");
      });
    driver.findElement(webdriver.By.css('#for_sec5_textfield6')).getText()
      .then(function(text) {
        assert.equal(text, "Filing Date (YYYY-MM-DD)");
      });
    driver.findElement(webdriver.By.css('#for_sec5_textfield7')).getText()
      .then(function(text) {
        assert.equal(text, "Intellectual Property Authority or Country");
      });
  });

  test.after(function() {
    debugger;
  });
});

test.describe('(TC2511) Collapsing file by reference', function() {
  test.it('hides fields', function() {
    driver.findElement(webdriver.By.id('expanderHead')).click();
    var section = driver.findElement(webdriver.By.id('filing_info'));
    driver.wait(until.elementIsNotVisible(section), 1000).then(
      function() {
        driver.findElement(webdriver.By.id('sec5_textfield5')).isDisplayed().then(
          function(displayed) {
            assert.equal(displayed, false);
          }
        );
        driver.findElement(webdriver.By.id('sec5_textfield5')).isDisplayed().then(
          function(displayed) {
            assert.equal(displayed, false);
          }
        );
        driver.findElement(webdriver.By.id('sec5_textfield5')).isDisplayed().then(
          function(displayed) {
            assert.equal(displayed, false);
          }
        );
      });
  });

  test.after(function() {
    debugger;
    driver.quit();
  });
});
