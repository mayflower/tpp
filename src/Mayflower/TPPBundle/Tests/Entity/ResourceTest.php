<?php

namespace Mayflower\TPPBundle\Tests\Entity;

use Mayflower\TPPBundle\Entity\Resource;

class ResourceTest extends \PHPUnit_Framework_TestCase
{
    /**
     * Test if ID after constructor is null
     *
     * @return null
     */
    public function testGetId()
    {
        $resource = new Resource();

        $this->assertEquals(null, $resource->getId());
    }

    /**
     * Test Name getting/setting
     *
     * @return null
     */
    public function testSetGetName()
    {
        $resource = new Resource();

        $this->assertEquals("", $resource->getName());
        $resource->setName("Awesome Teammember");
        $this->assertEquals("Awesome Teammember", $resource->getName());
    }
}
 