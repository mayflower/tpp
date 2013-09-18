<?php

namespace Mayflower\TPPBundle\Tests\Controller;

use Mayflower\TPPBundle\Entity\Project;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ProjectControllerTest extends WebTestCase
{
    private $project;
    private $em;

    protected function setUp()
    {
        parent::setUp();

        static::$kernel = static::createKernel();
        static::$kernel->boot();
        $this->em = static::$kernel->getContainer()
            ->get('doctrine')
            ->getManager();

        $this->project = new Project();
        $this->project->setName("ProjectControllerTest project");
        $this->project->setColor("#234567");
        $this->project->setBegin(new \DateTime());
        $this->project->setEnd(new \DateTime());

        $this->em->persist($this->project);
        $this->em->flush();
    }

    public function testDefaultIndex()
    {
        $client = static::createClient();

        $client->request('GET', '/api/project');
        $project = $client->getResponse();
        $this->assertEquals(
            200,
            $project->getStatusCode(),
            "Unexpected HTTP status code for GET /api/project"
        );

        $project_arr = [$this->project->toArray()];
        $this->assertEquals(json_encode($project_arr), $project->getContent());
    }

    public function testPost()
    {
        $client = static::createClient();

        $content = '{"name":"Test Project","color":"#123456","begin":"Mon Sep 09 2013 01:00:00 GMT+0100 (BST)","end":"Mon Sep 17 2013 01:00:00 GMT+0100 (BST)"}';

        $client->request('POST', '/api/project', array(), array(), array(), $content);
        $response = $client->getResponse();

        $this->assertEquals(
            200,
            $response->getStatusCode(),
            "Unexpected HTTP status code for POST /api/project"
        );

        $id = json_decode($response->getContent(), true)['id'];
        $project = $this->em->find('MayflowerTPPBundle:Project', $id);
        $this->assertEquals('Test Project', $project->getName());
        $this->assertEquals('#123456', $project->getColor());

        $begin_date = new \DateTime("Mon Sep 09 2013 00:00:00");
        $this->assertEquals($begin_date, $project->getBegin());

        $end_date = new \DateTime("Mon Sep 17 2013 00:00:00");
        $this->assertEquals($end_date, $project->getEnd());
    }

    public function testDelete()
    {
        $client = static::createClient();

        $client->request('DELETE', '/api/project/' . $this->project->getId());
        $response = $client->getResponse();
        $this->assertEquals(
            204,
            $response->getStatusCode(),
            "Unexpected HTTP status code for DELETE /api/project"
        );

        $project = $this->em->find('MayflowerTPPBundle:Project', $this->project->getId());
        $this->assertNotNull($project);
    }

    public function testDeleteWithNonExistentResource()
    {
        $client = static::createClient();

        $client->request('DELETE', '/api/project/' . ($this->project->getId() - 1));
        $response = $client->getResponse();
        $this->assertEquals(
            404,
            $response->getStatusCode(),
            "Unexpected HTTP status code for POST /api/project with non-existent project"
        );
    }

    protected function tearDown()
    {
        parent::tearDown();

        $projects = $this->em->getRepository('MayflowerTPPBundle:Project')->findAll();
        foreach ($projects as $project) {
            $this->em->remove($project);
        }
        $this->em->flush();
    }

}
