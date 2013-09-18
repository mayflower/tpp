<?php

namespace Mayflower\TPPBundle\Tests\Entity;

use Mayflower\TPPBundle\Entity\Project;

class ProjectTest extends \PHPUnit_Framework_TestCase
{

    /**
     * Test if ID after constructor is null
     *
     * @return null
     */
    public function testGetId()
    {
        $project = new Project();

        $this->assertEquals(null, $project->getId());
    }

    /**
     * Test title getting/setting
     *
     * @return null
     */
    public function testSetGetTitle()
    {
        $project = new Project();

        $this->assertEquals(null, $project->getName());
        $project->setName("Awesome Project");
        $this->assertEquals("Awesome Project", $project->getName());
    }

    /**
     * Test color getting/setting
     *
     * @return null
     */
    public function testSetGetColor()
    {
        $project = new Project();

        $this->assertEquals(null, $project->getColor());
        $project->setColor("#123456");
        $this->assertEquals("#123456", $project->getColor());
    }

    /**
     * Test week getting/setting
     *
     * @return null
     */
    public function testSetGetBegin()
    {
        $project = new Project();

        $this->assertEquals(null, $project->getBegin());

        $now = new \DateTime();
        $project->setBegin($now);

        $week = new \DateTime('midnight');
        $this->assertEquals($week, $project->getBegin());
    }

    /**
     * Test week getting/setting
     *
     * @return null
     */
    public function testSetGetEnd()
    {
        $project = new Project();

        $this->assertEquals(null, $project->getEnd());

        $now = new \DateTime();
        $project->setEnd($now);

        $week = new \DateTime('midnight');
        $this->assertEquals($week, $project->getEnd());
    }

    /**
     * Test transform to array
     *
     * @return null
     */
    public function testToArray()
    {
        $project = new Project();

        $this->assertArrayHasKey('id', $project->toArray());
        $this->assertArrayHasKey('color', $project->toArray());
        $this->assertArrayHasKey('name', $project->toArray());
        $this->assertArrayHasKey('begin', $project->toArray());
        $this->assertArrayHasKey('end', $project->toArray());
    }
}
