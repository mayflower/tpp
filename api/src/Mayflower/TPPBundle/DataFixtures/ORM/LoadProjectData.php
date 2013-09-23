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
use Mayflower\TPPBundle\Entity\Project;
use Mayflower\TPPBundle\Entity\Resource;

class LoadProjectData extends AbstractFixture implements OrderedFixtureInterface
{

    /**
     * Load data fixtures with the passed EntityManager
     *
     * @param Doctrine\Common\Persistence\ObjectManager|ObjectManager $manager
     */
    function load(ObjectManager $manager)
    {
        $project = new Project();
        $project->setName('TPP');
        $project->setColor('#123456');
        $project->setBegin(new \DateTime('14.08.2013'));
        $project->setEnd(new \DateTime('11.10.2013'));
        $project->setResourcesPerWeek(1);
        $manager->persist($project);

        $project = new Project();
        $project->setName('Admin');
        $project->setColor('#aaaaaa');
        $project->setBegin(new \DateTime('14.08.2013'));
        $project->setEnd(new \DateTime('11.10.2013'));
        $project->setResourcesPerWeek(1);
        $manager->persist($project);

        $project = new Project();
        $project->setName('Puppet');
        $project->setColor('#ff8844');
        $project->setBegin(new \DateTime('14.08.2013'));
        $project->setEnd(new \DateTime('11.10.2013'));
        $project->setResourcesPerWeek(1);
        $manager->persist($project);

        $project = new Project();
        $project->setName('Jenkins');
        $project->setColor('#654321');
        $project->setBegin(new \DateTime('14.08.2013'));
        $project->setEnd(new \DateTime('11.10.2013'));
        $project->setResourcesPerWeek(1);
        $manager->persist($project);
        $manager->flush();

        $this->setReference('project-tpp', $project);
    }

    /**
     * Get the order of this fixture
     *
     * @return integer
     */
    function getOrder()
    {
        return 2;
    }
}
