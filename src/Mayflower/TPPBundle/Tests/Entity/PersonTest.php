<?php

namespace Mayflower\TPPBundle\Tests\Entity;

use Mayflower\TPPBundle\Entity\Person;

class PersonTest extends \PHPUnit_Framework_TestCase {
    /**
     * Test if ID after constructor is null
     *
     * @return null
     */
    public function testGetId()
    {
        $person = new Person();

        $this->assertEquals(null, $person->getId());
    }

    /**
     * Test Name getting/setting
     *
     * @return null
     */
    public function testSetGetName()
    {
        $person = new Person();

        $this->assertEquals("", $person->getName());
        $person->setName("Awesome Teammember");
        $this->assertEquals("Awesome Teammember", $person->getName());
    }
}
 