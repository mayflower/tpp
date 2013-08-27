<?php

namespace Mayflower\TPPBundle\Tests\Entity;

use Mayflower\TPPBundle\Entity\Resource;
use Mayflower\TPPBundle\Entity\Task;

class TaskTest extends \PHPUnit_Framework_TestCase
{
    /**
     * Test if ID after constructor is null
     *
     * @return null
     */
    public function testGetId()
    {
        $task = new Task();

        $this->assertEquals(null, $task->getId());
    }

    /**
     * Test title getting/setting
     *
     * @return null
     */
    public function testSetGetTitle()
    {
        $task = new Task();

        $this->assertEquals("", $task->getTitle());
        $task->setTitle("Awesome Task");
        $this->assertEquals("Awesome Task", $task->getTitle());
    }

    /**
     * Test information getting/setting
     *
     * @return null
     */
    public function testSetGetInformation()
    {
        $task = new Task();

        $this->assertEquals("", $task->getInformation());
        $task->setInformation("Awesome Task Information foo");
        $this->assertEquals("Awesome Task Information foo", $task->getInformation());
    }

    /**
     * Test week getting/setting
     *
     * @return null
     */
    public function testSetGetWeek()
    {
        $task = new Task();

        $this->assertEquals(null, $task->getWeek());

        $now = new \DateTime();
        $task->setWeek($now);

        $week = new \DateTime('monday this week');
        $this->assertEquals($week, $task->getWeek());
    }

    /**
     * Test Resource getting/setting
     *
     * @return null
     */
    public function testSetGetResource()
    {
        $task = new Task();

        $this->assertEquals(null, $task->getResource());

        $resource = new Resource();
        $task->setResource($resource);
        $this->assertEquals($resource, $task->getResource());
    }
}
 