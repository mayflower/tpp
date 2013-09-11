<?php
/**
 * Created by PhpStorm.
 * User: robin
 * Date: 06.09.13
 * Time: 23:03
 */

namespace Mayflower\TPPBundle\Tests\Entity;

use Doctrine\ORM\EntityManager;
use Mayflower\TPPBundle\Entity\Task;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class TaskRepositoryTest extends WebTestCase
{

    /**
     * @var EntityManager
     */
    private $em;

    private $task;

    protected function setUp()
    {

        parent::setUp();

        static::$kernel = static::createKernel();
        static::$kernel->boot();
        $this->em = static::$kernel->getContainer()
            ->get('doctrine')
            ->getManager();

        $this->task = new Task();
        $this->task->setTitle('TaskRepositoryTest task');
        $dt = new \DateTime('next monday');
        $this->task->setWeek($dt);

        $this->em->persist($this->task);
        $this->em->flush();
    }

    public function testFindByWeeks()
    {
        $dt = new \DateTime('next monday');
        $tasks = $this->em->getRepository('MayflowerTPPBundle:Task')->findByWeeks($dt, 1);
        $this->assertEquals(1, count($tasks));

        $dt->modify('-2 weeks');
        $tasks = $this->em->getRepository('MayflowerTPPBundle:Task')->findByWeeks($dt, 1);
        $this->assertEquals(0, count($tasks));

        $tasks = $this->em->getRepository('MayflowerTPPBundle:Task')->findByWeeks($dt, 3);
        $this->assertEquals(1, count($tasks));

        $dt->modify('+4 weeks');
        $tasks = $this->em->getRepository('MayflowerTPPBundle:Task')->findByWeeks($dt, 1);
        $this->assertEquals(0, count($tasks));

    }

    protected function tearDown()
    {
        parent::tearDown();

        $this->em->remove($this->task);
        $this->em->flush();
    }

}
