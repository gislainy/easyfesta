// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by base.js.
import { name as packageName } from "meteor/gislainycrisostomo:base";

// Write your tests here!
// Here is an example.
Tinytest.add('base - example', function (test) {
  test.equal(packageName, "base");
});
