<?php

namespace Mayflower\TPPBundle\Tests\Entity;

use Mayflower\TPPBundle\Entity\Category;

class CategoryTest extends \PHPUnit_Framework_TestCase
{
    /**
     * Test if ID after constructor is null
     *
     * @return null
     */
    public function testGetId()
    {
        $category = new Category();

        $this->assertEquals(null, $category->getId());
    }

    /**
     * Test Name getting/setting
     *
     * @return null
     */
    public function testSetGetName()
    {
        $category = new Category();

        $this->assertEquals("", $category->getName());
        $category->setName("Awesome Team");
        $this->assertEquals("Awesome Team", $category->getName());
    }
}
