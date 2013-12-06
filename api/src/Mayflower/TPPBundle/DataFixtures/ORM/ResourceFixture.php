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

class ResourceFixture extends AbstractFixture implements OrderedFixtureInterface
{

    function load(ObjectManager $manager)
    {
        $resources = [];
        $names = ['Johannes', 'Marco', 'Markus', 'Micha', 'Robin', 'Rupi', 'Sebastian', 'Simon'];

        foreach ($names as $name) {
            $resource = new Resource();
            $resource->setName($name);
            $manager->persist($resource);
            $resources[] = $resource;
        }
        $manager->flush();

        foreach ($resources as $resource) {
            $this->setReference('Resource-'.$resource->getName(), $resource);
        }

    }

    function getOrder()
    {
        return 1;
    }
}
