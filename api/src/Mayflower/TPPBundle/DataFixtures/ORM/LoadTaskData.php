<?php
/**
 * Created by PhpStorm.
 * User: robin
 * Date: 19.09.13
 * Time: 18:49
 */

namespace Mayflower\TPPBundle\DataFixtures\ORM;


use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Mayflower\TPPBundle\Entity\Resource;
use Mayflower\TPPBundle\Entity\Task;

class LoadTaskData extends AbstractFixture implements OrderedFixtureInterface
{

    /**
     * Load data fixtures with the passed EntityManager
     *
     * @param Doctrine\Common\Persistence\ObjectManager|ObjectManager $manager
     */
    function load(ObjectManager $manager)
    {
        $task = new Task();
        $task->setResource($this->getReference('Resource-Robin'));

        $task->setProject($this->getReference('project-tpp'));
        $task->setWeek(new \DateTime('19.09.2013'));
        $task->setTitle('TPP Task');
        $manager->persist($task);
        $manager->flush();
    }

    /**
     * Get the order of this fixture
     *
     * @return integer
     */
    function getOrder()
    {
        return 3;
    }
}
