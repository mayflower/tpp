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

class LoadResourceData extends AbstractFixture implements OrderedFixtureInterface
{

    function load(ObjectManager $manager)
    {
        $resource = new Resource();
        $resource->setName('Robin');

        $manager->persist($resource);
        $manager->flush();

        $this->setReference('resource-robin', $resource);
    }

    function getOrder()
    {
        return 1;
    }
}